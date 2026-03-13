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
  Terminal,
  Folder,
  FileCode,
  Clock,
  ChevronRight
} from "lucide-react";
import { REPO_FILES, CHECKPOINTS } from "./LaunchData";

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
  const [selectedFile, setSelectedFile] = useState("components/ProductCard.js");
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(3);
  
  const [showManualGuidance, setShowManualGuidance] = useState(false);
  const [aiAgentStep, setAiAgentStep] = useState<"idle" | "thinking" | "generating" | "done">("idle");
  const [aiAgentMessage, setAiAgentMessage] = useState("");
  const [generatedCodeLines, setGeneratedCodeLines] = useState(0);
  const [prState, setPrState] = useState<"none" | "ready" | "creating" | "created">("none");
  const [currentMetrics, setCurrentMetrics] = useState({
    visibility: 54,
    accuracy: 61,
    sentiment: 58,
    coverage: 49
  });

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
    setAiAgentStep("thinking");
    setAiAgentMessage("AI analyzing repository...");
    setGeneratedCodeLines(0);
    setPrState("none");
    
    setTimeout(() => setAiAgentMessage("Thinking about optimization strategy..."), 1500);
    setTimeout(() => setAiAgentMessage("Evaluating product metadata..."), 3000);
    setTimeout(() => {
      setAiAgentMessage("Generating structured schema...");
      setAiAgentStep("generating");
      
      let lines = 0;
      const interval = setInterval(() => {
        lines += 3;
        setGeneratedCodeLines(lines);
        
        if (lines === 9) setAiAgentMessage("Step 1: Adding schema markup");
        if (lines === 24) setAiAgentMessage("Step 2: Updating product metadata");
        if (lines === 39) setAiAgentMessage("Step 3: Improving product descriptions");
        
        if (lines >= 60) {
          clearInterval(interval);
          setAiAgentStep("done");
          setAiAgentMessage("Optimization complete");
          setPrState("ready");
        }
      }, 300);
    }, 4500);
  };

  const createPR = () => {
    setPrState("creating");
    setTimeout(() => {
      setPrState("created");
    }, 2000);
  };


  const renderDiff = (original: string, optimized: string, type: 'original' | 'optimized') => {
    if (!original && !optimized) return "Select a file to view";
    
    let origLines = (original || "").split('\n');
    let optLines = (optimized || "").split('\n');
    
    if (type === 'optimized' && launchState === "optimizing" && (aiAgentStep === "generating" || aiAgentStep === "thinking")) {
      optLines = optLines.slice(0, generatedCodeLines);
    }
    
    if (type === 'original') {
      return origLines.map((line, i) => {
        const optLine = optLines[i];
        let bgColor = "transparent";
        let textColor = "text-zinc-300";
        let prefix = "  ";
        
        if (optLine !== undefined && line !== optLine) {
          bgColor = "bg-red-500/10";
          textColor = "text-red-400";
          prefix = "- ";
        } else if (optLine === undefined) {
          bgColor = "bg-red-500/10";
          textColor = "text-red-400";
          prefix = "- ";
        }
        
        return (
          <div key={i} className={`flex ${bgColor} ${textColor} px-2`}>
            <div className="w-8 text-right pr-4 text-zinc-500 select-none opacity-50">{i + 1}</div>
            <div className="select-none mr-2 opacity-50">{prefix}</div>
            <div>{line}</div>
          </div>
        );
      });
    } else {
      // For optimized side, we need to handle added lines
      // This is a very simplified diff that assumes lines are mostly 1:1 or added
      const result = [];
      let origIdx = 0;
      
      for (let i = 0; i < optLines.length; i++) {
        const line = optLines[i];
        const origLine = origLines[origIdx];
        
        let bgColor = "transparent";
        let textColor = "text-zinc-300";
        let prefix = "  ";
        
        if (origLine === line) {
          origIdx++;
        } else {
          // Check if it's a modified line or added line
          // Simple heuristic: if the next few lines match, it's added/modified
          bgColor = "bg-emerald-500/10";
          textColor = "text-emerald-400";
          prefix = "+ ";
          if (origLine && origLine !== line && optLines[i+1] === origLines[origIdx+1]) {
             // Modified
             bgColor = "bg-yellow-500/10";
             textColor = "text-yellow-400";
             prefix = "~ ";
             origIdx++;
          }
        }
        
        result.push(
          <div key={i} className={`flex ${bgColor} ${textColor} px-2`}>
            <div className="w-8 text-right pr-4 text-zinc-500 select-none opacity-50">{i + 1}</div>
            <div className="select-none mr-2 opacity-50">{prefix}</div>
            <div>{line}</div>
          </div>
        );
      }
      return result;
    }
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
          <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Current AI Performance
            </h2>
              
              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Visibility Score", value: currentMetrics.visibility, color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5", icon: Eye },
                  { label: "Accuracy Score", value: currentMetrics.accuracy, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", icon: CheckCircle2 },
                  { label: "Sentiment Score", value: currentMetrics.sentiment, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", icon: MessageSquare },
                  { label: "Coverage Score", value: currentMetrics.coverage, color: "text-pink-400", border: "border-pink-500/20", bg: "bg-pink-500/5", icon: Activity },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`${card.bg} border ${card.border} rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <card.icon className={`w-3.5 h-3.5 ${card.color} opacity-70`} />
                      <div className="text-xs text-zinc-400">{card.label}</div>
                    </div>
                    <div className={`text-2xl font-bold ${card.color}`}>{card.value}%</div>
                    <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${card.color.replace("text-", "bg-")}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${card.value}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="mt-2">
                <div className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wider">Performance Overview</div>
                <div className="flex gap-3">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between pb-7 pr-1" style={{ height: "192px" }}>
                    {[100, 75, 50, 25, 0].map((tick) => (
                      <span key={tick} className="text-xs text-zinc-600 text-right leading-none">{tick}</span>
                    ))}
                  </div>

                  {/* Bars + grid */}
                  <div className="flex-1 relative" style={{ height: "192px" }}>
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 pb-7 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-t border-zinc-800/60 w-full" />
                      ))}
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end gap-4 pb-7 px-2">
                      {[
                        { label: "Visibility", value: currentMetrics.visibility, gradFrom: "#7c3aed", gradTo: "#a78bfa", glow: "rgba(139,92,246,0.4)", text: "#a78bfa" },
                        { label: "Accuracy",   value: currentMetrics.accuracy,   gradFrom: "#1d4ed8", gradTo: "#60a5fa", glow: "rgba(96,165,250,0.4)",  text: "#60a5fa" },
                        { label: "Sentiment",  value: currentMetrics.sentiment,  gradFrom: "#065f46", gradTo: "#34d399", glow: "rgba(52,211,153,0.4)",  text: "#34d399" },
                        { label: "Coverage",   value: currentMetrics.coverage,   gradFrom: "#9d174d", gradTo: "#f472b6", glow: "rgba(244,114,182,0.4)", text: "#f472b6" },
                      ].map((bar, i) => {
                        const MAX_BAR_H = 140; // px (out of 192 - 28 label area)
                        const barH = (bar.value / 100) * MAX_BAR_H;
                        return (
                          <div key={bar.label} className="flex-1 flex flex-col items-center gap-0 h-full justify-end group">
                            {/* Value tooltip on hover */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 + i * 0.15 }}
                              className="text-xs font-semibold mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              style={{ color: bar.text }}
                            >
                              {bar.value}%
                            </motion.div>

                            {/* Bar */}
                            <motion.div
                              style={{
                                height: `${barH}px`,
                                background: `linear-gradient(to top, ${bar.gradFrom}, ${bar.gradTo})`,
                                boxShadow: `0 0 16px ${bar.glow}`,
                                transformOrigin: "bottom",
                                borderRadius: "6px 6px 2px 2px",
                              }}
                              className="w-full"
                              initial={{ scaleY: 0, opacity: 0 }}
                              animate={{ scaleY: 1, opacity: 1 }}
                              transition={{
                                scaleY: { duration: 1.1, ease: [0.34, 1.2, 0.64, 1], delay: i * 0.15 },
                                opacity: { duration: 0.3, delay: i * 0.15 },
                              }}
                            />

                            {/* Label */}
                            <span className="text-xs text-zinc-400 mt-2 font-medium">{bar.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-semibold">Pre-launch Analysis</h2>
              <p className="text-zinc-400 mt-1">We found 3 critical missing elements for AI visibility.</p>
            </div>
            
            {launchState === "comparison" && (
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowManualGuidance(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                >
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

          {/* AI Agent Workspace Panel */}
          {(launchState === "optimizing" || launchState === "done") && (
            <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Agent Workspace</h2>
                  <p className="text-sm text-zinc-400">Arcana is optimizing your repository</p>
                </div>
              </div>
              
              <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 font-mono text-sm">
                <div className="flex items-center gap-3 text-indigo-400">
                  {aiAgentStep !== "done" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={aiAgentStep === "done" ? "text-emerald-400" : ""}>
                    {aiAgentMessage}
                    {aiAgentStep !== "done" && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ...
                      </motion.span>
                    )}
                  </span>
                </div>
              </div>
              
              {prState === "ready" && (
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={createPR}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    <GitBranch className="w-4 h-4" />
                    Create Pull Request
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pull Request Workflow UI */}
          {(prState !== "none" && prState !== "ready") && (
            <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Pull Request</h2>
                  <p className="text-sm text-zinc-400">AI Optimization for New Section</p>
                </div>
              </div>

              {prState === "creating" && (
                <div className="flex items-center gap-3 text-zinc-300">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </motion.div>
                  Creating Pull Request...
                </div>
              )}

              {prState === "created" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 p-4 rounded-xl text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  Pull request created successfully.
                </motion.div>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-6">
            {/* File Explorer */}
            <div className="lg:col-span-3 bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
              <div className="h-12 border-b border-zinc-800 bg-[#252526] flex items-center px-4 gap-2">
                <Folder className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">Repository</span>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                {REPO_FILES.map((item, i) => (
                  <div key={i} className="mb-1">
                    {item.type === "folder" ? (
                      <div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800/50 rounded cursor-pointer">
                          <ChevronRight className="w-3 h-3 text-zinc-500" />
                          <Folder className="w-4 h-4 text-zinc-400" />
                          {item.name}
                        </div>
                        <div className="pl-6 border-l border-zinc-800 ml-3 mt-1 space-y-1">
                          {item.children?.map((child, j) => {
                            const path = `${item.name}/${child.name}`;
                            const isSelected = selectedFile === path;
                            return (
                              <div 
                                key={j}
                                onClick={() => setSelectedFile(path)}
                                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer transition-colors ${
                                  isSelected ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                                }`}
                              >
                                <FileCode className="w-4 h-4 opacity-70" />
                                {child.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setSelectedFile(item.name)}
                        className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer transition-colors ${
                          selectedFile === item.name ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                        }`}
                      >
                        <FileCode className="w-4 h-4 opacity-70" />
                        {item.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Comparison */}
            <div className="lg:col-span-9 grid md:grid-cols-2 gap-4">
              {/* Left Side: Current Code */}
              <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
                <div className="h-12 border-b border-zinc-800 bg-[#252526] flex items-center px-4 gap-4">
                  <Code2 className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300 font-mono">{selectedFile.split('/').pop()}</span>
                  <span className="text-xs text-red-400 ml-auto bg-red-400/10 px-2 py-1 rounded">Original</span>
                </div>
                <div className="flex-1 py-4 font-mono text-sm overflow-y-auto whitespace-pre">
                  {renderDiff(
                    CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.files[selectedFile as keyof typeof CHECKPOINTS[0]['files']]?.original || "",
                    CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.files[selectedFile as keyof typeof CHECKPOINTS[0]['files']]?.optimized || "",
                    'original'
                  )}
                </div>
              </div>

              {/* Right Side: Optimized Code */}
              <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px] relative">
                <div className="h-12 border-b border-zinc-800 bg-[#252526] flex items-center px-4 gap-4">
                  <Code2 className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300 font-mono">{selectedFile.split('/').pop()}</span>
                  <span className="text-xs text-emerald-400 ml-auto bg-emerald-400/10 px-2 py-1 rounded">Optimized</span>
                </div>
                
                {launchState === "comparison" && (
                  <div className="absolute inset-0 top-12 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <Zap className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                      <p className="text-zinc-300 font-medium">Ready to optimize</p>
                    </div>
                  </div>
                )}

                <div className="flex-1 py-4 font-mono text-sm overflow-y-auto whitespace-pre">
                  {renderDiff(
                    CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.files[selectedFile as keyof typeof CHECKPOINTS[0]['files']]?.original || "",
                    CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.files[selectedFile as keyof typeof CHECKPOINTS[0]['files']]?.optimized || "",
                    'optimized'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Repository Optimization Timeline */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              Repository Optimization Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
              
              {/* Timeline Nodes */}
              <div className="relative z-10 flex justify-between">
                {CHECKPOINTS.map((checkpoint, index) => {
                  const isSelected = selectedCheckpoint === checkpoint.id;
                  const isPast = index <= CHECKPOINTS.findIndex(c => c.id === selectedCheckpoint);
                  
                  return (
                    <div 
                      key={checkpoint.id}
                      onClick={() => setSelectedCheckpoint(checkpoint.id)}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      {/* Node */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                        isSelected 
                          ? "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                          : isPast
                            ? "bg-zinc-800 border-indigo-500/50 text-indigo-300"
                            : "bg-zinc-900 border-zinc-700 text-zinc-500 group-hover:border-zinc-500"
                      }`}>
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-medium">{index + 1}</span>}
                      </div>
                      
                      {/* Label */}
                      <div className="mt-3 text-center w-32">
                        <p className={`text-xs font-medium transition-colors ${
                          isSelected ? "text-indigo-300" : isPast ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"
                        }`}>
                          {checkpoint.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          {checkpoint.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Checkpoint Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCheckpoint}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 bg-[#1e1e1e] border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.name}
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-2xl">
                      {CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.description}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        if (selectedCheckpoint > 1) {
                          setSelectedCheckpoint(selectedCheckpoint - 1);
                        }
                      }}
                      disabled={selectedCheckpoint === 1}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Compare Previous
                    </button>
                    <button 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Changes
                    </button>
                    <button 
                      onClick={() => {
                        alert(`Restoring snapshot: ${CHECKPOINTS.find(c => c.id === selectedCheckpoint)?.name}`);
                      }}
                      className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg transition-colors border border-indigo-500/20 flex items-center gap-2"
                    >
                      <GitBranch className="w-4 h-4" />
                      Restore Snapshot
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
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
                const showScore = launchState === "done" || selectedCheckpoint >= 3;
                const displayScore = showScore ? score.score - (5 - selectedCheckpoint) * 2 : "--";
                
                return (
                  <motion.div 
                    key={score.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: showScore ? i * 0.1 : 0 }}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                      <Icon className={`w-3 h-3 ${score.color.replace('bg-', 'text-')}`} />
                      {score.name}
                    </div>
                    <div className="text-xl font-semibold text-zinc-100">
                      {displayScore}{showScore ? "%" : ""}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {(launchState === "done" || selectedCheckpoint >= 4) && (
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
      {/* Manual Guidance Modal */}
      {showManualGuidance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#252526] rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Manual Optimization Guidance</h2>
              <button onClick={() => setShowManualGuidance(false)} className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Visibility */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-violet-400 flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Visibility Guidance
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Visibility improves when AI assistants can easily identify your product pages. Ensure product pages contain detailed descriptions, structured metadata, pricing information, and customer reviews.
                </p>
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                  <h4 className="text-sm font-medium text-zinc-200 mb-2">Suggested Actions:</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Update website product descriptions</li>
                    <li>Add structured metadata for products</li>
                    <li>Improve product page content</li>
                    <li>Include pricing information</li>
                    <li>Add customer reviews and ratings</li>
                  </ul>
                </div>
              </div>

              {/* Accuracy */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Accuracy Guidance
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  AI assistants may provide incorrect recommendations when website data is outdated or inconsistent. Ensure pricing, availability, and product specifications are accurate and up to date.
                </p>
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                  <h4 className="text-sm font-medium text-zinc-200 mb-2">Suggested Actions:</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Fix incorrect pricing</li>
                    <li>Update product availability</li>
                    <li>Correct outdated information</li>
                    <li>Remove inaccurate comparisons</li>
                  </ul>
                </div>
              </div>

              {/* Sentiment */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Sentiment Guidance
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Positive sentiment improves how AI assistants recommend your products. Adding verified reviews, testimonials, and clear value propositions helps AI systems interpret positive product perception.
                </p>
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                  <h4 className="text-sm font-medium text-zinc-200 mb-2">Suggested Actions:</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Encourage customer reviews</li>
                    <li>Highlight positive testimonials</li>
                    <li>Improve product descriptions</li>
                  </ul>
                </div>
              </div>

              {/* Coverage */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-pink-400 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Coverage Guidance
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Coverage improves when AI systems have access to more product details. Provide clear specifications, features, use cases, and comparisons.
                </p>
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                  <h4 className="text-sm font-medium text-zinc-200 mb-2">Suggested Actions:</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Add detailed product attributes</li>
                    <li>Expand product specifications</li>
                    <li>Include use cases and features</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
