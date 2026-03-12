import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GitBranch, 
  Github, 
  Rocket, 
  Zap, 
  Code2, 
  CheckCircle2, 
  Eye, 
  MessageSquare, 
  Activity,
  ArrowRight,
  Terminal
} from "lucide-react";

const MINI_SCORES = [
  { id: "visibility", name: "Visibility", score: 88, color: "bg-violet-500", icon: Eye },
  { id: "accuracy", name: "Accuracy", score: 92, color: "bg-blue-500", icon: CheckCircle2 },
  { id: "sentiment", name: "Sentiment", score: 85, color: "bg-emerald-500", icon: MessageSquare },
  { id: "freshness", name: "Freshness", score: 95, color: "bg-amber-500", icon: Zap },
  { id: "coverage", name: "Coverage", score: 89, color: "bg-pink-500", icon: Activity }
];

export default function Launch() {
  const [launchState, setLaunchState] = useState<"idle" | "analyzing" | "comparison" | "optimizing" | "done">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const startAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setLaunchState("analyzing");
    
    setTimeout(() => {
      setLaunchState("comparison");
    }, 2000);
  };

  const startFix = () => {
    setLaunchState("optimizing");
    setLogs([]);
    
    const fixLogs = [
      "Analyzing new-gaming-laptops branch...",
      "Generating SEO-optimized descriptions...",
      "Adding structured JSON-LD schema...",
      "Enhancing product attributes...",
      "Creating Pull Request..."
    ];
    
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < fixLogs.length) {
        setLogs(prev => [...prev, fixLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setLaunchState("done"), 1000);
      }
    }, 800);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
          <Rocket className="w-8 h-8 text-indigo-400" />
          Launch Optimizer
        </h1>
        <p className="text-zinc-400 mt-2">Optimize new product sections before they go live.</p>
      </div>

      {/* Section 1: Input */}
      {launchState === "idle" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm max-w-2xl"
        >
          <form onSubmit={startAnalysis} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Repository Name</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  defaultValue="exampletech-store"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Branch Name</label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  defaultValue="new-gaming-laptops"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                Analyze New Section
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Analyzing State */}
      {launchState === "analyzing" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-12 h-12 text-indigo-400 mb-6" />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-2">Analyzing Branch</h2>
          <p className="text-zinc-400">Arcana is scanning the new-gaming-laptops branch for AI readiness...</p>
        </motion.div>
      )}

      {/* Section 2: Code Comparison */}
      {(launchState === "comparison" || launchState === "optimizing" || launchState === "done") && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-semibold">Pre-launch Analysis</h2>
              <p className="text-zinc-400 mt-1">We found 3 critical missing elements for AI visibility.</p>
            </div>
            
            {launchState === "comparison" && (
              <div className="flex gap-4">
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
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Side: Current Code */}
            <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
              <div className="h-12 border-b border-zinc-800 bg-[#252526] flex items-center px-4 gap-4">
                <Code2 className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300 font-mono">gaming-laptop.tsx</span>
                <span className="text-xs text-red-400 ml-auto bg-red-400/10 px-2 py-1 rounded">Current</span>
              </div>
              <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-zinc-300">
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">1</div>export default function GamingLaptop() {'{'}</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">2</div>  return (</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">3</div>    &lt;div&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">4</div>      &lt;h1&gt;TitanX Gaming Laptop&lt;/h1&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">5</div>      &lt;p&gt;A fast laptop for gaming.&lt;/p&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">6</div>      &lt;ul&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">7</div>        &lt;li&gt;16GB RAM&lt;/li&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">8</div>        &lt;li&gt;1TB SSD&lt;/li&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">9</div>      &lt;/ul&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">10</div>      &lt;button&gt;Buy Now - $1299&lt;/button&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">11</div>    &lt;/div&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">12</div>  );</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">13</div>{'}'}</div>
              </div>
            </div>

            {/* Right Side: Optimized Code */}
            <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px] relative">
              <div className="h-12 border-b border-zinc-800 bg-[#252526] flex items-center px-4 gap-4">
                <Code2 className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300 font-mono">gaming-laptop.tsx</span>
                <span className="text-xs text-emerald-400 ml-auto bg-emerald-400/10 px-2 py-1 rounded">AI Optimized</span>
              </div>
              
              {launchState === "comparison" && (
                <div className="absolute inset-0 top-12 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                    <p className="text-zinc-300 font-medium">Ready to optimize</p>
                  </div>
                </div>
              )}

              <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-zinc-300">
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">1</div>export default function GamingLaptop() {'{'}</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">2</div>  return (</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">3</div>    &lt;div&gt;</div>
                
                <AnimatePresence>
                  {(launchState === "optimizing" || launchState === "done") && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-emerald-900/20 border-l-2 border-emerald-500"
                    >
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>      &lt;script type="application/ld+json"&gt;</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>        {`{`}</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>          "@context": "https://schema.org/",</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>          "@type": "Product",</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>          "name": "TitanX Gaming Laptop",</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>          "offers": {`{`} "@type": "Offer", "price": "1299.00", "priceCurrency": "USD" {`}`}</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>        {`}`}</div>
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>      &lt;/script&gt;</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">12</div>      &lt;h1&gt;TitanX Gaming Laptop&lt;/h1&gt;</div>
                
                <AnimatePresence>
                  {(launchState === "optimizing" || launchState === "done") && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-emerald-900/20 border-l-2 border-emerald-500"
                    >
                      <div className="flex text-emerald-400"><div className="w-8 text-right pr-4 text-emerald-500/50 select-none">+</div>      &lt;p&gt;Experience desktop-level performance with the TitanX Gaming Laptop. Featuring the latest RTX 4080 GPU, 16GB DDR5 RAM, and a lightning-fast 1TB NVMe SSD.&lt;/p&gt;</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">15</div>      &lt;ul&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">16</div>        &lt;li&gt;16GB RAM&lt;/li&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">17</div>        &lt;li&gt;1TB SSD&lt;/li&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">18</div>      &lt;/ul&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">19</div>      &lt;button&gt;Buy Now - $1299&lt;/button&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">20</div>    &lt;/div&gt;</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">21</div>  );</div>
                <div className="flex"><div className="w-8 text-right pr-4 text-zinc-500 select-none">22</div>{'}'}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Agent Process & Mini Dashboard */}
      {(launchState === "optimizing" || launchState === "done") && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Process Logs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[250px]">
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
              {launchState === "optimizing" && (
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-indigo-500"
                />
              )}
            </div>
          </div>

          {/* Mini Dashboard */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <h3 className="text-lg font-medium mb-4">Projected AI Visibility</h3>
            <p className="text-sm text-zinc-400 mb-6">Estimated metrics for this section after deployment.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MINI_SCORES.map((score, i) => {
                const Icon = score.icon;
                return (
                  <motion.div 
                    key={score.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: launchState === "done" ? i * 0.1 : 0 }}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                      <Icon className={`w-3 h-3 ${score.color.replace('bg-', 'text-')}`} />
                      {score.name}
                    </div>
                    <div className="text-xl font-semibold text-zinc-100">
                      {launchState === "done" ? score.score : "--"}%
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {launchState === "done" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-auto pt-6"
              >
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Merge PR
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
