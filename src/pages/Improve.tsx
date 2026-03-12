import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Code2, 
  Eye, 
  Github, 
  MessageSquare, 
  Slack, 
  Zap,
  GitPullRequest,
  RefreshCw,
  Server,
  Terminal
} from "lucide-react";

const INITIAL_SCORES = [
  { id: "visibility", name: "Visibility", score: 62, color: "bg-violet-500", icon: Eye },
  { id: "accuracy", name: "Accuracy", score: 71, color: "bg-blue-500", icon: CheckCircle2 },
  { id: "sentiment", name: "Sentiment", score: 67, color: "bg-emerald-500", icon: MessageSquare },
  { id: "freshness", name: "Freshness", score: 58, color: "bg-amber-500", icon: Zap },
  { id: "coverage", name: "Coverage", score: 64, color: "bg-pink-500", icon: Activity }
];

const UPDATED_SCORES = [
  { id: "visibility", name: "Visibility", score: 75, color: "bg-violet-500", icon: Eye },
  { id: "accuracy", name: "Accuracy", score: 84, color: "bg-blue-500", icon: CheckCircle2 },
  { id: "sentiment", name: "Sentiment", score: 78, color: "bg-emerald-500", icon: MessageSquare },
  { id: "freshness", name: "Freshness", score: 80, color: "bg-amber-500", icon: Zap },
  { id: "coverage", name: "Coverage", score: 76, color: "bg-pink-500", icon: Activity }
];

const FIX_LOGS = [
  "Scanning product pages...",
  "Checking metadata...",
  "Detecting missing schema...",
  "Generating structured data...",
  "Updating product descriptions...",
  "Creating Pull Request..."
];

export default function Improve() {
  const [activeScore, setActiveScore] = useState<string | null>(null);
  const [fixState, setFixState] = useState<"idle" | "fixing" | "pr" | "deploying" | "rescanning" | "done">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [scores, setScores] = useState(INITIAL_SCORES);

  const startFix = () => {
    setFixState("fixing");
    setLogs([]);
    
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < FIX_LOGS.length) {
        setLogs(prev => [...prev, FIX_LOGS[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setFixState("pr"), 1000);
      }
    }, 800);
  };

  const approvePR = () => {
    setFixState("deploying");
    setTimeout(() => {
      setFixState("rescanning");
      setTimeout(() => {
        setScores(UPDATED_SCORES);
        setFixState("done");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Improve & Update</h1>
        <p className="text-zinc-400 mt-2">Let Arcana's AI agents fix your website to optimize AI visibility.</p>
      </div>

      {/* Section 1: Current Health Bars */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-6">Current Health Scores</h2>
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {scores.map((score) => {
            const Icon = score.icon;
            const isActive = activeScore === score.id;
            return (
              <button
                key={score.id}
                onClick={() => setActiveScore(isActive ? null : score.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isActive 
                    ? "bg-zinc-800 border-indigo-500 ring-1 ring-indigo-500" 
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                  <Icon className={`w-4 h-4 ${score.color.replace('bg-', 'text-')}`} />
                  {score.name}
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold">{score.score}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${score.color}`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Issue Panel */}
        <AnimatePresence mode="wait">
          {activeScore === "freshness" && fixState === "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-zinc-100">AI assistants reference outdated product data</h3>
                    <p className="text-zinc-400 mt-1 text-sm">We detected that major AI platforms are using cached information from 3 months ago.</p>
                    
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Issues Detected</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Outdated product price on 12 pages
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Missing structured metadata (JSON-LD)
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Incomplete product descriptions
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors">
                        Do It Yourself
                      </button>
                      <button 
                        onClick={startFix}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      >
                        <Zap className="w-4 h-4" />
                        Let Our Agent Fix It
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 2: Integrations */}
      {fixState === "idle" && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6">Active Integrations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-zinc-100" />
                <div>
                  <div className="font-medium text-sm text-zinc-100">GitHub</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
                  </div>
                </div>
              </div>
              <button className="text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Configure</button>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Slack className="w-6 h-6 text-zinc-100" />
                <div>
                  <div className="font-medium text-sm text-zinc-100">Slack</div>
                  <div className="text-xs text-zinc-500">Not connected</div>
                </div>
              </div>
              <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Connect</button>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-zinc-100" />
                <div>
                  <div className="font-medium text-sm text-zinc-100">MS Teams</div>
                  <div className="text-xs text-zinc-500">Not connected</div>
                </div>
              </div>
              <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Connect</button>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: AI Agent Fixing Simulation */}
      {fixState !== "idle" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Code Editor / Diff View */}
          <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="h-12 border-b border-zinc-800 bg-[#252526] flex items-center px-4 gap-4">
              <Code2 className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300 font-mono">product-page.tsx</span>
              <span className="text-xs text-zinc-500 ml-auto">Working Tree</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">1</div>
                <div className="text-zinc-300">export default function Product() {'{'}</div>
              </div>
              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">2</div>
                <div className="text-zinc-300">  return (</div>
              </div>
              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">3</div>
                <div className="text-zinc-300">    &lt;div&gt;</div>
              </div>
              
              {/* Diff Addition Animation */}
              <AnimatePresence>
                {logs.length > 3 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-emerald-900/20 border-l-2 border-emerald-500"
                  >
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">      &lt;script type="application/ld+json"&gt;</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">        {`{`}</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">          "@context": "https://schema.org/",</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">          "@type": "Product",</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">          "name": "ExampleTech Laptop Pro",</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">          "description": "High performance laptop for professionals."</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">        {`}`}</div>
                    </div>
                    <div className="flex text-emerald-500/50">
                      <div className="w-8 text-right pr-4 select-none">+</div>
                      <div className="text-emerald-400">      &lt;/script&gt;</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">12</div>
                <div className="text-zinc-300">      &lt;h1&gt;ExampleTech Laptop Pro&lt;/h1&gt;</div>
              </div>
              
              {/* Diff Modification */}
              <AnimatePresence>
                {logs.length > 4 && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-red-900/20 border-l-2 border-red-500"
                    >
                      <div className="flex text-red-500/50">
                        <div className="w-8 text-right pr-4 select-none">-</div>
                        <div className="text-red-400 line-through">      &lt;p&gt;A good laptop.&lt;/p&gt;</div>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-emerald-900/20 border-l-2 border-emerald-500"
                    >
                      <div className="flex text-emerald-500/50">
                        <div className="w-8 text-right pr-4 select-none">+</div>
                        <div className="text-emerald-400">      &lt;p&gt;The ultimate high-performance laptop featuring a 14-core processor, 32GB RAM, and an all-day battery life. Perfect for coding, design, and gaming.&lt;/p&gt;</div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">15</div>
                <div className="text-zinc-300">    &lt;/div&gt;</div>
              </div>
              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">16</div>
                <div className="text-zinc-300">  );</div>
              </div>
              <div className="flex text-zinc-500">
                <div className="w-8 text-right pr-4 select-none">17</div>
                <div className="text-zinc-300">{'}'}</div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Logs */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[200px]">
              <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2">
                <Terminal className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">Agent Activity Logs</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2 text-zinc-400"
                    >
                      <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-indigo-400">{log}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {fixState === "fixing" && (
                  <motion.div 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-4 bg-indigo-500"
                  />
                )}
              </div>
            </div>

            {/* PR Card */}
            <AnimatePresence mode="wait">
              {fixState === "pr" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <GitPullRequest className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-zinc-100">optimize-product-metadata</h3>
                      <p className="text-zinc-400 text-sm mt-1">Arcana Agent wants to merge 2 commits into <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">main</code></p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                      View PR
                    </button>
                    <button 
                      onClick={approvePR}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {fixState === "deploying" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[160px]"
                >
                  <Server className="w-8 h-8 text-indigo-400 mb-4 animate-pulse" />
                  <h3 className="text-lg font-medium text-zinc-100">Deploying Changes...</h3>
                  <p className="text-zinc-400 text-sm mt-1">Updating production website</p>
                </motion.div>
              )}

              {fixState === "rescanning" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[160px]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-8 h-8 text-indigo-400 mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-zinc-100">Secret Shopper Rescanning...</h3>
                  <p className="text-zinc-400 text-sm mt-1">Verifying improvements across AI platforms</p>
                </motion.div>
              )}

              {fixState === "done" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-900/20 border border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[160px]"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-medium text-zinc-100">Optimization Complete</h3>
                  <p className="text-emerald-400/80 text-sm mt-1">Scores have been updated successfully</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Final CTA */}
      {fixState === "done" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-8"
        >
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-8 py-3 text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <Zap className="w-4 h-4" />
            Optimize All Remaining Issues
          </button>
        </motion.div>
      )}
    </div>
  );
}
