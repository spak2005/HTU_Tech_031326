import { useState, useEffect, useMemo } from "react";
import { GitBranch } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { CORE_METRICS, computeAioScore, getScoreBand } from '../data/dashboardMetrics';

type FixMode = "diy" | "agent" | null;

interface HealthMetric {
  id: string;
  label: string;
  score: number;
  color: string;
  issues: string[];
  recommendation: string;
  diySteps: string[];
}

interface ConnectionConfig {
  connected: boolean;
  url: string;
  token?: string;
}

interface ConnectionsState {
  github: ConnectionConfig;
  slack: ConnectionConfig;
  teams: ConnectionConfig;
}

const healthMetrics: HealthMetric[] = [
  {
    id: "visibility",
    label: "Visibility",
    score: 72,
    color: "#00E5CC",
    issues: [
      "Your brand is missing from 3 of 5 major AI assistant responses",
      "Competitors appear 2x more frequently in 'best product' queries",
      "No structured data markup detected on product pages",
    ],
    recommendation:
      "Add FAQ schema and JSON-LD structured data to your top 5 product pages. AI models heavily favor parseable content when generating recommendations.",
    diySteps: [
      "Add JSON-LD product schema to each product page",
      "Create a dedicated comparison page (Your Brand vs. Competitors)",
      "Submit updated sitemap to Google Search Console",
      "Publish 2–3 blog posts targeting 'best [category]' queries",
    ],
  },
  {
    id: "accuracy",
    label: "Accuracy",
    score: 88,
    color: "#A8FF78",
    issues: [
      "1 AI model cited an outdated price ($299 vs. current $249)",
      "Feature list missing 'offline mode' on 2 AI platforms",
      "Return policy described incorrectly by ChatGPT",
    ],
    recommendation:
      "Your accuracy is strong but a few stale data points are circulating. Update your pricing page with clear, machine-readable formatting and add a dedicated 'product facts' section.",
    diySteps: [
      "Update pricing page with explicit, unambiguous price display",
      "Add a 'Key Features' bullet list in plain HTML (not image-based)",
      "Publish a clear return policy page with FAQ format",
      "Request re-indexing from major search engines",
    ],
  },
  {
    id: "sentiment",
    label: "Sentiment",
    score: 61,
    color: "#FFD93D",
    issues: [
      "AI assistants use neutral-to-negative language when describing your brand",
      "3 negative reviews from 2023 are being heavily weighted",
      "Competitor review volume is 4x higher, skewing comparisons",
    ],
    recommendation:
      "Sentiment is your biggest growth lever. Older negative reviews are disproportionately influencing AI outputs. A proactive review generation campaign would shift this quickly.",
    diySteps: [
      "Launch a post-purchase email asking happy customers for reviews",
      "Respond publicly to all negative reviews (AI models read responses too)",
      "Create a testimonials page with rich, specific customer quotes",
      "Submit a press release or case study to industry publications",
    ],
  },
  {
    id: "coverage",
    label: "Coverage by LLM",
    score: 45,
    color: "#FF6B6B",
    issues: [
      "Your brand does not appear in Gemini or Perplexity responses at all",
      "Only mentioned in ChatGPT for 1 of 6 tested query types",
      "Content is not optimized for conversational query formats",
    ],
    recommendation:
      "LLM coverage is critically low — your content isn't being picked up by most AI models. This is the highest-priority fix. Your pages need to speak the language of AI queries.",
    diySteps: [
      "Rewrite product descriptions in Q&A / conversational format",
      "Create a 'People Also Ask' style FAQ for each product",
      "Get featured in at least 2 authoritative industry roundup articles",
      "Ensure your brand appears on Wikipedia or Wikidata if applicable",
    ],
  },
];

const FIX_LOGS: string[] = [
  "Scanning product pages…",
  "Checking metadata…",
  "Detecting missing schema…",
  "Generating structured data…",
  "Updating product descriptions…",
];

export default function ImproveUpdate() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mode, setMode] = useState<Record<string, FixMode>>({});
  const [agentLaunched, setAgentLaunched] = useState<Record<string, boolean>>(
    {}
  );
  const [fixState, setFixState] = useState<
    "idle" | "fixing" | "pr" | "deploying" | "rescanning" | "done"
  >("idle");
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [prCreated, setPrCreated] = useState<Record<string, boolean>>({});
  const [connections, setConnections] = useState<ConnectionsState>({
    github: { connected: false, url: "https://github.com/your-org/your-repo", token: "" },
    slack: { connected: false, url: "https://your-workspace.slack.com", token: "" },
    teams: {
      connected: false,
      url: "https://teams.microsoft.com/l/channel/your-chat",
      token: "",
    },
  });
  const [barsMounted, setBarsMounted] = useState(false);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const setFixMode = (metricId: string, m: FixMode) =>
    setMode((prev) => ({ ...prev, [metricId]: m }));

  const startFix = (metricId: string) => {
    setFixState("fixing");
    setLogs((prev) => ({ ...prev, [metricId]: [] }));

    let index = 0;
    const interval = setInterval(() => {
      if (index < FIX_LOGS.length) {
        const next = FIX_LOGS[index];
        setLogs((prev) => ({
          ...prev,
          [metricId]: [...(prev[metricId] ?? []), next],
        }));
        index += 1;
      } else {
        clearInterval(interval);
        setTimeout(() => setFixState("pr"), 800);
      }
    }, 800);
  };

  const onCreatePullRequest = (metricId: string) => {
    setPrCreated((prev) => ({ ...prev, [metricId]: true }));
    setLogs((prev) => ({
      ...prev,
      [metricId]: [
        ...(prev[metricId] ?? []),
        "Creating pull request…",
        "Pull request created.",
      ],
    }));
  };

  const onLooksGood = () => {
    setFixState("idle");
    setLogs((prev) =>
      expanded
        ? { ...prev, [expanded]: [...(prev[expanded] ?? []), "Done."] }
        : prev
    );
    setExpanded(null);
  };

  const launchAgent = (metricId: string) => {
    setAgentLaunched((prev) => ({ ...prev, [metricId]: true }));
    if (fixState === "idle" || fixState === "done") {
      startFix(metricId);
    }
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Fair";
    return "Critical";
  };

  const updateConnectionUrl = (key: keyof ConnectionsState, value: string) => {
    setConnections((prev) => ({
      ...prev,
      [key]: { ...prev[key], url: value },
    }));
  };

  const connectService = (key: keyof ConnectionsState) => {
    setConnections((prev) => {
      const c = prev[key];
      const hasUrl = !!c.url?.trim();
      const hasToken = !!(c as { token?: string }).token?.trim();
      return {
        ...prev,
        [key]: { ...c, connected: hasUrl && hasToken },
      };
    });
  };

  const updateConnectionToken = (key: keyof ConnectionsState, value: string) => {
    setConnections((prev) => ({
      ...prev,
      [key]: { ...prev[key], token: value },
    }));
  };

  function scoreColor(score: number): string {
    if (score <= 39) return '#ef4444';
    if (score <= 59) return '#f97316';
    if (score <= 79) return '#f59e0b';
    return '#10b981';
  }

  const aioScore = computeAioScore(CORE_METRICS);
  const band = getScoreBand(aioScore);

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarsMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!barsMounted) return;
    const durationMs = 1200;
    const start = performance.now();
    let rafId = 0;
    const update = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setDisplayScore(Math.round(aioScore * progress));
      if (progress < 1) rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [barsMounted, aioScore]);

  const radialData = useMemo(
    () => [{ name: 'AIO', value: displayScore, fill: scoreColor(displayScore) }],
    [displayScore]
  );

  return (
    <div style={s.page}>
      <div className="flex justify-end px-8 pt-5 pb-2">
        <div className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4 shadow-sm">
          <div className="relative h-16 w-16">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={radialData}
                startAngle={210}
                endAngle={-30}
                innerRadius="70%"
                outerRadius="100%"
                barSize={8}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background cornerRadius={6} animationDuration={1200} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-black uppercase tracking-wider text-text-heading">AIO</span>
            </div>
          </div>
          <div>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-black tracking-tight text-text-heading">{displayScore}</span>
              <span className="pb-0.5 text-xs text-text">/100</span>
            </div>
            <span className={`mt-1 inline-block rounded-full bg-surface-alt px-2.5 py-0.5 text-[10px] font-semibold uppercase ${band.tone}`}>
              {band.label}
            </span>
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Active Integrations — square boxes, color-coded */}
        <div style={s.accountsRow}>
          <div style={s.accountsHeaderRow}>
            <h2 style={s.accountsTitle}>Active Integrations</h2>
            <p style={s.accountsSubLine}>
              Connect GitHub and one messaging platform to enable agent actions and alerts.
            </p>
          </div>
          <div style={s.integrationBoxesRow}>
            {/* GitHub — blue */}
            <div style={{ ...s.integrationBox, ...s.integrationBoxGitHub }}>
              <div style={s.integrationBoxHeader}>
                <span style={{ ...s.integrationBoxIcon, background: "#238636", color: "#fff" }}>GH</span>
                <span style={s.integrationBoxTitle}>GitHub</span>
                <span style={{ ...s.integrationBoxStatus, color: connections.github.connected ? "#3fb950" : "var(--color-text)" }}>
                  {connections.github.connected ? "Connected" : "Not connected"}
                </span>
              </div>
              <input
                style={s.integrationBoxInput}
                value={connections.github.url}
                onChange={(e) => updateConnectionUrl("github", e.target.value)}
                placeholder="https://github.com/org/repo"
              />
              {connections.github.url && (
                <input
                  style={s.integrationBoxInput}
                  type="password"
                  value={connections.github.token ?? ""}
                  onChange={(e) => updateConnectionToken("github", e.target.value)}
                  placeholder="GitHub access token (required)"
                />
              )}
              <button
                style={{
                  ...s.integrationBoxBtn,
                  background: connections.github.connected ? "var(--color-surface-alt)" : "#238636",
                  color: connections.github.connected ? "var(--color-text)" : "#fff",
                  border: connections.github.connected ? "1px solid var(--color-border)" : "none",
                }}
                disabled={
                  connections.github.connected ||
                  !connections.github.url?.trim() ||
                  !(connections.github.token ?? "").trim()
                }
                onClick={() => connectService("github")}
              >
                {connections.github.connected ? "Connected" : "Connect"}
              </button>
            </div>

            {/* Slack — plum */}
            <div style={{ ...s.integrationBox, ...s.integrationBoxSlack }}>
              <div style={s.integrationBoxHeader}>
                <span style={{ ...s.integrationBoxIcon, background: "#611f69", color: "#fff" }}>S</span>
                <span style={s.integrationBoxTitle}>Slack</span>
                <span style={{ ...s.integrationBoxStatus, color: connections.slack.connected ? "#e01e5a" : "var(--color-text)" }}>
                  {connections.slack.connected ? "Connected" : "Not connected"}
                </span>
              </div>
              <input
                style={s.integrationBoxInput}
                value={connections.slack.url}
                onChange={(e) => updateConnectionUrl("slack", e.target.value)}
                placeholder="https://workspace.slack.com"
              />
              {connections.slack.url && (
                <input
                  style={s.integrationBoxInput}
                  type="password"
                  value={connections.slack.token ?? ""}
                  onChange={(e) => updateConnectionToken("slack", e.target.value)}
                  placeholder="Slack token / webhook (required)"
                />
              )}
              <button
                style={{
                  ...s.integrationBoxBtn,
                  background: connections.slack.connected ? "var(--color-surface-alt)" : "#611f69",
                  color: connections.slack.connected ? "var(--color-text)" : "#fff",
                  border: connections.slack.connected ? "1px solid var(--color-border)" : "none",
                }}
                disabled={
                  connections.slack.connected ||
                  !connections.slack.url?.trim() ||
                  !(connections.slack.token ?? "").trim()
                }
                onClick={() => connectService("slack")}
              >
                {connections.slack.connected ? "Connected" : "Connect"}
              </button>
            </div>

            {/* Teams */}
            <div style={{ ...s.integrationBox, ...s.integrationBoxTeams }}>
              <div style={s.integrationBoxHeader}>
                <span style={{ ...s.integrationBoxIcon, background: "#5B2E91", color: "#fff" }}>T</span>
                <span style={s.integrationBoxTitle}>MS Teams</span>
                <span style={{ ...s.integrationBoxStatus, color: connections.teams.connected ? "#6264A7" : "var(--color-text)" }}>
                  {connections.teams.connected ? "Connected" : "Not connected"}
                </span>
              </div>
              <input
                style={s.integrationBoxInput}
                value={connections.teams.url}
                onChange={(e) => updateConnectionUrl("teams", e.target.value)}
                placeholder="https://teams.microsoft.com/..."
              />
              {connections.teams.url && (
                <input
                  style={s.integrationBoxInput}
                  type="password"
                  value={connections.teams.token ?? ""}
                  onChange={(e) => updateConnectionToken("teams", e.target.value)}
                  placeholder="Teams webhook / token (required)"
                />
              )}
              <button
                style={{
                  ...s.integrationBoxBtn,
                  background: connections.teams.connected ? "var(--color-surface-alt)" : "#5B2E91",
                  color: connections.teams.connected ? "var(--color-text)" : "#fff",
                  border: connections.teams.connected ? "1px solid var(--color-border)" : "none",
                }}
                disabled={
                  connections.teams.connected ||
                  !connections.teams.url?.trim() ||
                  !(connections.teams.token ?? "").trim()
                }
                onClick={() => connectService("teams")}
              >
                {connections.teams.connected ? "Connected" : "Connect"}
              </button>
            </div>
          </div>
        </div>

        <div style={s.topRow}>
          <div style={s.topRowLeft}>
            <h1 style={s.heading}>AIO HEALTH BAR</h1>
            <div style={s.healthMetaRow}>
              <div style={s.healthLineOuter}>
                <div style={s.healthLineInner} />
              </div>
              <span style={s.healthMetaAccent}>Live view of brand metrics</span>
            </div>
            <p style={s.subheading}>
              Click any metric to see issues and get recommendations from your AI operators.
            </p>
          </div>
        </div>

        <div style={s.mainLayout}>
          <div style={s.mainLeft}>
            {/* Your existing health bar layout */}
            <div style={s.metricsGrid}>
          {healthMetrics.map((m) => (
            <div key={m.id} style={s.metricWrapper}>
              <button
                style={{
                  ...s.metricCard,
                  borderColor: expanded === m.id ? m.color : "var(--color-border)",
                  borderBottomLeftRadius: expanded === m.id ? 0 : 10,
                  borderBottomRightRadius: expanded === m.id ? 0 : 10,
                }}
                onClick={() => toggleExpand(m.id)}
              >
                <div style={s.metricTop}>
                  <span style={s.metricLabel}>{m.label}</span>
                  <div style={s.metricRight}>
                    <span style={{ ...s.metricTag, color: m.color }}>
                      {getScoreLabel(m.score)}
                    </span>
                    <span style={{ ...s.metricScore, color: m.color }}>
                      {m.score}%
                    </span>
                    <span style={s.chevron}>
                      {expanded === m.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
                <div style={s.barBg}>
                  <div
                    style={{
                      ...s.barFill,
                      width: `${barsMounted ? m.score : 0}%`,
                      background: m.color,
                      boxShadow: `0 0 12px ${m.color}88`,
                    }}
                  />
                </div>
              </button>

              {expanded === m.id && (
                <div style={{ ...s.expandedPanel, borderColor: m.color }}>
                  <p style={s.expandedTitle}>⚠ Issues Detected</p>
                  <ul style={s.issueList}>
                    {m.issues.map((issue, i) => (
                      <li key={i} style={s.issueItem}>
                        {issue}
                      </li>
                    ))}
                  </ul>

                  <div style={{ ...s.recCard, borderColor: `${m.color}44` }}>
                    <p style={{ ...s.recLabel, color: m.color }}>
                      ✦ AI RECOMMENDATION
                    </p>
                    <p style={s.recText}>{m.recommendation}</p>
                  </div>

                  {!mode[m.id] && (
                    <div style={s.actionRow}>
                      <p style={s.actionPrompt}>
                        How would you like to fix this?
                      </p>
                      <div style={s.actionBtns}>
                        <button
                          style={s.diyBtn}
                          onClick={() => setFixMode(m.id, "diy")}
                        >
                          DIY — Show Me How
                        </button>
                        <button
                          style={{
                            ...s.agentBtn,
                            borderColor: m.color,
                            color: m.color,
                          }}
                          onClick={() => setFixMode(m.id, "agent")}
                        >
                          Let Our Agents Fix It
                        </button>
                      </div>
                    </div>
                  )}

                  {mode[m.id] === "diy" && (
                    <div style={s.diyPanel}>
                      <p style={s.diyTitle}>YOUR ACTION CHECKLIST</p>
                      {m.diySteps.map((step, i) => (
                        <div key={i} style={s.diyStep}>
                          <span
                            style={{
                              ...s.stepNum,
                              borderColor: m.color,
                              color: m.color,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={s.stepText}>{step}</span>
                        </div>
                      ))}
                      <button
                        style={s.backBtn}
                        onClick={() => setFixMode(m.id, null)}
                      >
                        ← Back
                      </button>
                    </div>
                  )}

                  {mode[m.id] === "agent" && (
                    <div style={s.agentPanel}>
                      {fixState === "idle" && !agentLaunched[m.id] && (
                        <>
                          <p style={s.agentDesc}>
                            Our agent will analyze your site, draft the
                            recommended changes, and open a pull request in your
                            connected GitHub repo for your review.
                          </p>
                          <div style={s.agentBtnRow}>
                            <button
                              style={{
                                ...s.launchBtn,
                                background: m.color,
                              }}
                              onClick={() => launchAgent(m.id)}
                            >
                              🚀 Launch Agent
                            </button>
                            <button
                              style={s.backBtn}
                              onClick={() => setFixMode(m.id, null)}
                            >
                              ← Back
                            </button>
                          </div>
                        </>
                      )}

                      {fixState !== "idle" && (
                        <div style={s.agentInlineBlock}>
                          <p style={s.successTitle}>
                            Agent is working on {m.label.toLowerCase()}…
                          </p>
                          <div style={s.codeCard}>
                            <div style={s.codeHeader}>
                              <span style={s.codeHeaderLabel}>product-page.tsx</span>
                              <span style={s.codeHeaderSide}>Working Tree</span>
                            </div>
                            <div style={s.codeBody}>
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>1</span>
                                <span style={s.codeText}>export default function Product &#123;</span>
                              </div>
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>2</span>
                                <span style={s.codeText}>  return (</span>
                              </div>
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>3</span>
                                <span style={s.codeText}>    &lt;div&gt;</span>
                              </div>
                              {logs.length > 3 && (
                                <div style={s.diffBlockAdded}>
                                  <div style={s.codeLine}>
                                    <span style={s.codeLineNumber}>+</span>
                                    <span style={s.diffText}>&lt;script type="application/ld+json"&gt;</span>
                                  </div>
                                  <div style={s.codeLine}>
                                    <span style={s.codeLineNumber}>+</span>
                                    <span style={s.diffText}>&#123; "@type": "Product" &#125;</span>
                                  </div>
                                  <div style={s.codeLine}>
                                    <span style={s.codeLineNumber}>+</span>
                                    <span style={s.diffText}>&lt;/script&gt;</span>
                                  </div>
                                </div>
                              )}
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>12</span>
                                <span style={s.codeText}>&lt;h1&gt;ExampleTech Laptop Pro&lt;/h1&gt;</span>
                              </div>
                              {logs.length > 4 && (
                                <>
                                  <div style={s.diffBlockRemoved}>
                                    <div style={s.codeLine}>
                                      <span style={s.codeLineNumber}>-</span>
                                      <span style={s.diffTextRemoved}>&lt;p&gt;A good laptop.&lt;/p&gt;</span>
                                    </div>
                                  </div>
                                  <div style={s.diffBlockAdded}>
                                    <div style={s.codeLine}>
                                      <span style={s.codeLineNumber}>+</span>
                                      <span style={s.diffText}>&lt;p&gt;High-performance laptop with 14-core processor, 32GB RAM, and all-day battery life.&lt;/p&gt;</span>
                                    </div>
                                  </div>
                                </>
                              )}
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>15</span>
                                <span style={s.codeText}>    &lt;/div&gt;</span>
                              </div>
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>16</span>
                                <span style={s.codeText}>  );</span>
                              </div>
                              <div style={s.codeLine}>
                                <span style={s.codeLineNumber}>17</span>
                                <span style={s.codeText}>&#125;</span>
                              </div>
                            </div>
                          </div>
                          {fixState === "pr" && (
                            <div style={s.prCard}>
                              <div style={s.prTitle}>optimize-product-metadata</div>
                              <p style={s.prText}>
                                Arcana Agent wants to merge 2 commits into{" "}
                                <span style={s.prCode}>main</span>
                              </p>
                              <div style={s.prButtons}>
                                {prCreated[m.id] ? (
                                  <div style={s.prCreatedWrap}>
                                    <GitBranch style={s.prIcon} />
                                    <span style={s.prCreatedText}>Pull Request Created</span>
                                  </div>
                                ) : (
                                  <button
                                    style={s.prPrimary}
                                    onClick={() => onCreatePullRequest(m.id)}
                                  >
                                    <GitBranch style={s.prIcon} />
                                    <span>Create Pull Request</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <div style={s.logsCard}>
                            <div style={s.logsHeader}>
                              <span>Agent Activity Logs</span>
                            </div>
                            <div style={s.logsBody}>
                              {(logs[m.id] ?? []).map((log, i) => (
                                <div key={i} style={s.logRow}>
                                  <span style={s.logTime}>
                                    [{new Date().toLocaleTimeString()}]
                                  </span>
                                  <span style={s.logText}>{log}</span>
                                </div>
                              ))}
                              {fixState === "fixing" && (
                                <div style={s.logCursor} />
                              )}
                            </div>
                          </div>

                          {fixState === "deploying" && (
                            <div style={s.statusCard}>
                              <div style={s.statusTitle}>Applying changes…</div>
                              <p style={s.statusText}>Processing your request.</p>
                            </div>
                          )}

                          {fixState === "rescanning" && (
                            <div style={s.statusCard}>
                              <div style={s.statusTitle}>Secret Shopper Rescanning…</div>
                              <p style={s.statusText}>
                                Verifying improvements across AI platforms.
                              </p>
                            </div>
                          )}

                          {fixState === "done" && (
                            <>
                              <div style={s.doneCard}>
                                <div style={s.statusTitle}>Optimization Complete</div>
                                <p style={s.doneText}>
                                  Scores have been updated successfully. You can now optimize
                                  remaining issues or mark this as done.
                                </p>
                              </div>
                              <div style={s.finalCtaWrap}>
                                <button style={s.finalCta} onClick={onLooksGood}>
                                  Looks good
                                </button>
                                <button style={s.finalCtaSecondary}>
                                  ⚡ Optimize All Remaining Issues
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text-heading)", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  content: { padding: "24px 32px", maxWidth: 1120, margin: "0 auto" },
  mainLayout: { display: "flex", alignItems: "flex-start", gap: 24 },
  mainLeft: { flex: 1, minWidth: 0 },
  topRow: { marginBottom: 24 },
  topRowLeft: { display: "flex", flexDirection: "column", gap: 8 },
  heading: { fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: 1, color: "var(--color-text-heading)" },
  healthMetaRow: { display: "flex", alignItems: "center", gap: 10 },
  healthLineOuter: {
    width: 160,
    height: 4,
    borderRadius: 999,
    background: "var(--color-surface-alt)",
    overflow: "hidden",
  },
  healthLineInner: {
    width: "100%",
    height: "100%",
    backgroundImage:
      "linear-gradient(90deg, #FF6B6B 0%, #FFD93D 35%, #A8FF78 70%, #00E5CC 100%)",
    boxShadow: "0 0 14px #00E5CC55",
  },
  healthMetaAccent: { fontSize: 12, color: "var(--color-text)", whiteSpace: "nowrap", letterSpacing: 1 },
  subheading: { fontSize: 13, color: "var(--color-text-heading)", margin: 0, lineHeight: 1.6 },
  metricsGrid: { display: "flex", flexDirection: "column", gap: 12 },
  metricWrapper: { display: "flex", flexDirection: "column" },
  metricCard: { background: "var(--color-surface)", border: "1px solid", borderRadius: 10, padding: "18px 22px", cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 0.2s", boxSizing: "border-box" },
  metricTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  metricLabel: { fontSize: 15, fontWeight: 700, color: "var(--color-text-heading)", letterSpacing: 0.5 },
  metricRight: { display: "flex", alignItems: "center", gap: 12 },
  metricTag: { fontSize: 11, letterSpacing: 2, fontWeight: 700 },
  metricScore: { fontSize: 22, fontWeight: 700 },
  chevron: { color: "var(--color-text)", fontSize: 10 },
  barBg: { height: 8, background: "var(--color-border)", borderRadius: 99 },
  barFill: { height: "100%", borderRadius: 99, transition: "width 0.8s ease-out" },
  expandedPanel: { background: "var(--color-surface)", border: "1px solid", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "22px 24px" },
  expandedTitle: { fontSize: 11, letterSpacing: 2, color: "var(--color-text-heading)", fontWeight: 600, marginTop: 0, marginBottom: 12 },
  issueList: { paddingLeft: 18, margin: "0 0 20px 0" },
  issueItem: { color: "var(--color-text-heading)", fontSize: 14, marginBottom: 8, lineHeight: 1.6 },
  recCard: { background: "var(--color-surface-alt)", border: "1px solid", borderRadius: 8, padding: "16px 20px", marginBottom: 20 },
  recLabel: { fontSize: 10, letterSpacing: 3, marginTop: 0, marginBottom: 8 },
  recText: { fontSize: 14, color: "var(--color-text-heading)", lineHeight: 1.7, margin: 0 },
  actionRow: { marginTop: 4 },
  actionPrompt: { fontSize: 13, color: "var(--color-text-heading)", fontWeight: 600, marginBottom: 12 },
  actionBtns: { display: "flex", gap: 12, flexWrap: "wrap" },
  diyBtn: { padding: "10px 20px", background: "transparent", border: "1px solid var(--color-border)", color: "var(--color-text-heading)", borderRadius: 8, cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 },
  agentBtn: { padding: "10px 20px", background: "transparent", border: "1px solid", borderRadius: 8, cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 0.5 },
  diyPanel: { marginTop: 8 },
  diyTitle: { fontSize: 11, letterSpacing: 2, color: "var(--color-text-heading)", fontWeight: 700, marginBottom: 16 },
  diyStep: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  stepNum: { minWidth: 24, height: 24, border: "1px solid", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  stepText: { fontSize: 14, color: "var(--color-text-heading)", lineHeight: 1.6, paddingTop: 2 },
  backBtn: { marginTop: 16, background: "transparent", border: "none", color: "var(--color-text-heading)", cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', fontSize: 13, fontWeight: 500, padding: 0, letterSpacing: 0.5 },
  agentPanel: { marginTop: 8 },
  agentDesc: { fontSize: 14, color: "var(--color-text-heading)", lineHeight: 1.7, marginBottom: 16, marginTop: 0 },
  agentBtnRow: { display: "flex", alignItems: "center", gap: 16 },
  launchBtn: { padding: "12px 24px", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', fontSize: 14, cursor: "pointer", letterSpacing: 0.5 },
  successCard: { textAlign: "center", padding: "20px 0" },
  successIcon: { fontSize: 36, margin: "0 0 8px 0" },
  successTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--color-text-heading)" },
  successText: { fontSize: 14, color: "var(--color-text)", lineHeight: 1.7, maxWidth: 380, margin: "0 auto" },
  connectedUrl: { fontSize: 11, color: "var(--color-text)", marginTop: 4, wordBreak: "break-all" },
  accountsRow: { marginBottom: 28 },
  accountsHeaderRow: { marginBottom: 14 },
  accountsTitle: { fontSize: 18, fontWeight: 600, margin: "0 0 6px", color: "var(--color-text-heading)" },
  accountsSub: { fontSize: 12, color: "var(--color-text)", margin: 0, lineHeight: 1.5 },
  accountsSubLine: { fontSize: 14, color: "var(--color-text-heading)", margin: "4px 0 0", lineHeight: 1.5 },
  integrationBoxesRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  integrationBox: { flex: 1, minWidth: 200, maxWidth: 320, borderRadius: 12, padding: 16, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, border: "2px solid", minHeight: 160 },
  integrationBoxGitHub: { borderColor: "#238636", background: "linear-gradient(180deg, rgba(35,134,54,0.12) 0%, var(--color-surface) 100%)" },
  integrationBoxSlack: { borderColor: "#611f69", background: "linear-gradient(180deg, rgba(97,31,105,0.15) 0%, var(--color-surface) 100%)" },
  integrationBoxTeams: { borderColor: "#5B2E91", background: "linear-gradient(180deg, rgba(91,46,145,0.15) 0%, var(--color-surface) 100%)" },
  integrationBoxHeader: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  integrationBoxIcon: { width: 32, height: 32, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  integrationBoxTitle: { fontSize: 16, fontWeight: 600, color: "var(--color-text-heading)" },
  integrationBoxStatus: { fontSize: 12, marginLeft: "auto" },
  integrationBoxInput: { width: "100%", boxSizing: "border-box", background: "var(--color-surface-alt)", border: "1px solid var(--color-border)", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "var(--color-text-heading)", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', outline: "none" },
  integrationBoxBtn: { padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  accountHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 },
  accountLabel: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--color-text)" },
  accountStatusOk: { fontSize: 11, color: "#00E5CC", fontWeight: 600 },
  accountInput: { width: "100%", boxSizing: "border-box", background: "var(--color-surface-alt)", border: "1px solid var(--color-border)", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "var(--color-text-heading)", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', marginBottom: 6, outline: "none" },
  accountButton: { width: "100%", padding: "7px 10px", borderRadius: 8, border: "none", background: "#00E5CC", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  accountButtonDisabled: { width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-surface-alt)", color: "var(--color-text)", fontSize: 12, fontWeight: 600, cursor: "default", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },

  agentInlineBlock: { marginTop: 12, display: "flex", flexDirection: "column", gap: 12 },
  agentLogsOnly: { marginTop: 24 },
  agentGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: 18, marginTop: 24 },
  agentGridLeft: { display: "flex", flexDirection: "column", gap: 12, minWidth: 0 },
  codeCard: { background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10, overflow: "hidden" },
  codeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border)", fontSize: 11, color: "var(--color-text)" },
  codeHeaderLabel: { fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  codeHeaderSide: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--color-text)" },
  codeBody: { padding: "10px 12px", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', fontSize: 12, background: "#050509" },
  codeLine: { display: "flex", alignItems: "flex-start", gap: 10, lineHeight: 1.5 },
  codeLineNumber: { width: 24, textAlign: "right", color: "#444", userSelect: "none" },
  codeText: { color: "#ddd", whiteSpace: "pre" },
  diffBlockAdded: { marginTop: 6, paddingLeft: 0, borderLeft: "2px solid #1E4620", background: "#07130A" },
  diffBlockRemoved: { marginTop: 6, paddingLeft: 0, borderLeft: "2px solid #4A1A1A", background: "#140707" },
  diffText: { color: "#6EE787", whiteSpace: "pre" },
  diffTextRemoved: { color: "#FF7B7B", whiteSpace: "pre" },

  agentSide: { display: "flex", flexDirection: "column", gap: 12 },
  logsCard: { background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "10px 12px", maxHeight: 220, display: "flex", flexDirection: "column" },
  logsHeader: { fontSize: 12, color: "var(--color-text)", marginBottom: 6 },
  logsBody: { flex: 1, overflowY: "auto", paddingRight: 4 },
  logRow: { display: "flex", gap: 6, fontSize: 11, marginBottom: 4 },
  logTime: { color: "var(--color-text)", flexShrink: 0 },
  logText: { color: "var(--color-text)" },
  logCursor: { width: 10, height: 14, background: "#00E5CC", animation: "blink 1s infinite alternate" },

  prCard: { marginTop: 10, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "10px 12px" },
  prTitle: { fontSize: 13, fontWeight: 600, color: "var(--color-text-heading)", marginBottom: 4 },
  prText: { fontSize: 12, color: "var(--color-text)", margin: "0 0 10px" },
  prCode: { fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', background: "var(--color-surface-alt)", padding: "1px 4px", borderRadius: 4 },
  prButtons: { display: "flex", gap: 8, flexWrap: "wrap" },
  prIcon: { width: 16, height: 16, marginRight: 6, display: "inline-block" },
  prPrimary: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "var(--color-primary)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    display: "inline-flex",
    alignItems: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  prCreatedWrap: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #16A34A",
    background: "rgba(34,197,94,0.1)",
    display: "inline-flex",
    alignItems: "center",
    boxShadow: "0 0 16px rgba(34,197,94,0.2)",
    transform: "scale(1.03)",
  },
  prCreatedText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#15803d",
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },

  statusCard: { marginTop: 10, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "12px 14px" },
  statusTitle: { fontSize: 13, fontWeight: 600, color: "var(--color-text-heading)", marginBottom: 4 },
  statusText: { fontSize: 12, color: "var(--color-text)", margin: 0 },

  doneCard: { marginTop: 10, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "12px 14px" },
  doneText: { fontSize: 12, color: "#15803d", fontWeight: 500, margin: 0 },

  finalCtaWrap: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" },
  finalCta: { padding: "12px 24px", borderRadius: 10, border: "none", background: "#00E5CC", color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif', boxShadow: "0 0 18px #00E5CC55" },
  finalCtaSecondary: { padding: "12px 24px", borderRadius: 10, border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-heading)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif' },
};