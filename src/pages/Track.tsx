import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Globe, 
  Terminal, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  BarChart3,
  Activity,
  Zap,
  Eye,
  MessageSquare
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";

const MOCK_LOGS = [
  "Agent 1 analyzing homepage...",
  "Agent 2 extracting product data...",
  "Agent 3 verifying structured metadata...",
  "Agent 1 building knowledge graph...",
  "Agent 2 detecting missing schema...",
  "Agent 3 compiling sentiment analysis...",
  "Scan complete. Preparing AI platform tests..."
];

const AI_PLATFORMS = [
  { name: "ChatGPT", color: "bg-emerald-500" },
  { name: "Perplexity", color: "bg-cyan-500" },
  { name: "Gemini", color: "bg-blue-500" },
  { name: "Claude", color: "bg-orange-500" },
  { name: "Copilot", color: "bg-purple-500" }
];

const PROMPTS = [
  "Best laptops under $500",
  "Best laptop for college students",
  "Best budget gaming laptop",
  "Best laptop for programming",
  "Top rated business laptops 2024"
];

const CURRENT_SCORES = [
  { name: "Visibility", score: 62, fill: "#8b5cf6" },
  { name: "Accuracy", score: 71, fill: "#3b82f6" },
  { name: "Sentiment", score: 67, fill: "#10b981" },
  { name: "Freshness", score: 58, fill: "#f59e0b" },
  { name: "Coverage", score: 64, fill: "#ec4899" }
];

const OVERTIME_DATA = [
  { name: "Week 1", Visibility: 30, Accuracy: 45, Sentiment: 40, Freshness: 35, Coverage: 38 },
  { name: "Week 2", Visibility: 42, Accuracy: 55, Sentiment: 48, Freshness: 42, Coverage: 45 },
  { name: "Week 3", Visibility: 55, Accuracy: 62, Sentiment: 58, Freshness: 50, Coverage: 55 },
  { name: "Week 4", Visibility: 62, Accuracy: 71, Sentiment: 67, Freshness: 58, Coverage: 64 },
];

export default function Track() {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<"idle" | "scanning" | "testing" | "dashboard">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [promptCount, setPromptCount] = useState(0);
  const [activePrompt, setActivePrompt] = useState("");
  const [activePlatform, setActivePlatform] = useState(0);

  const startScan = (e: React.FormEvent) => {
    e.preventDefault();
    setScanState("scanning");
    setLogs([]);
    
    // Simulate logs
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < MOCK_LOGS.length) {
        setLogs(prev => [...prev, MOCK_LOGS[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setScanState("testing"), 1000);
      }
    }, 800);
  };

  useEffect(() => {
    if (scanState === "testing") {
      let count = 0;
      const testInterval = setInterval(() => {
        if (count <= 100) {
          setPromptCount(count);
          setActivePrompt(PROMPTS[count % PROMPTS.length]);
          setActivePlatform(count % AI_PLATFORMS.length);
          count += 2; // Speed up the counter
        } else {
          clearInterval(testInterval);
          setTimeout(() => setScanState("dashboard"), 1000);
        }
      }, 100);
      return () => clearInterval(testInterval);
    }
  }, [scanState]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Secret Shopper Agent</h1>
        <p className="text-zinc-400 mt-2">Monitor how your brand appears across major AI assistants.</p>
      </div>

      {/* Section 1: Input */}
      {scanState === "idle" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
        >
          <form onSubmit={startScan} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-zinc-300">Company Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="url" 
                  required
                  defaultValue="https://www.examplelaptops.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-zinc-300">Brand Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  defaultValue="ExampleTech"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Start AI Scan
            </button>
          </form>
        </motion.div>
      )}

      {/* Section 2: Scanning Visualization */}
      {scanState === "scanning" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Browser Simulation */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Browser Chrome */}
            <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md h-7 flex items-center px-3 text-xs text-zinc-500 font-mono">
                https://www.examplelaptops.com
              </div>
            </div>
            {/* Browser Content */}
            <div className="flex-1 p-8 relative overflow-hidden bg-zinc-950">
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Mock Website Header */}
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <div className="w-32 h-8 bg-zinc-800 rounded-md"></div>
                  <div className="flex gap-4">
                    <div className="w-16 h-4 bg-zinc-800 rounded-sm"></div>
                    <div className="w-16 h-4 bg-zinc-800 rounded-sm"></div>
                    <div className="w-16 h-4 bg-zinc-800 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Mock Website Hero */}
                <div className="space-y-4 relative">
                  <motion.div 
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0)", "0 0 0 2px rgba(99, 102, 241, 0.5)", "0 0 0 0 rgba(99, 102, 241, 0)"] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3/4 h-12 bg-zinc-800 rounded-lg"
                  />
                  <div className="w-1/2 h-4 bg-zinc-800 rounded-sm"></div>
                  <div className="w-1/3 h-4 bg-zinc-800 rounded-sm"></div>
                  
                  {/* Scanning Cursor */}
                  <motion.div 
                    animate={{ 
                      x: [0, 200, 50, 300, 0],
                      y: [0, 50, 150, 100, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 text-indigo-400 flex flex-col items-center pointer-events-none z-10"
                  >
                    <Bot className="w-6 h-6" />
                    <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/50 mt-1 whitespace-nowrap">
                      Extracting metadata
                    </span>
                  </motion.div>
                </div>

                {/* Mock Website Grid */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        borderColor: ["rgba(39, 39, 42, 1)", "rgba(99, 102, 241, 0.5)", "rgba(39, 39, 42, 1)"] 
                      }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2"
                    >
                      <div className="flex-1 bg-zinc-800 rounded-lg"></div>
                      <div className="w-3/4 h-3 bg-zinc-800 rounded-sm"></div>
                      <div className="w-1/2 h-3 bg-zinc-800 rounded-sm"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logs Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[500px]">
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
                    <span className={log.includes("complete") ? "text-emerald-400" : "text-indigo-400"}>
                      {log}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length > 0 && !logs[logs.length - 1].includes("complete") && (
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-indigo-500"
                />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 3: AI Platform Testing */}
      {scanState === "testing" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Testing AI Platforms</h2>
          <p className="text-zinc-400 mb-8">Simulating 100 shopping prompts across major AI assistants...</p>

          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {AI_PLATFORMS.map((platform, i) => (
              <motion.div 
                key={platform.name}
                animate={{ 
                  scale: activePlatform === i ? 1.1 : 1,
                  opacity: activePlatform === i ? 1 : 0.5
                }}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full"
              >
                <div className={`w-2 h-2 rounded-full ${platform.color}`}></div>
                <span className="text-sm font-medium">{platform.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-100" style={{ width: `${promptCount}%` }}></div>
            <div className="flex justify-between items-center mb-4 text-sm text-zinc-400">
              <span>Sending Prompt</span>
              <span className="font-mono">{promptCount} / 100</span>
            </div>
            <div className="text-lg font-medium text-indigo-300 h-14 flex items-center justify-center">
              "{activePrompt}"
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 4: AI Visibility Dashboard */}
      {scanState === "dashboard" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-semibold">AI Visibility Dashboard</h2>
              <p className="text-zinc-400 mt-1">Analysis complete. Here is how ExampleTech appears to AI.</p>
            </div>
            <button 
              onClick={() => navigate("/improve")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
            >
              Improve & Update
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Visibility", value: "62%", icon: Eye, color: "text-violet-400" },
              { label: "Accuracy", value: "71%", icon: CheckCircle2, color: "text-blue-400" },
              { label: "Sentiment", value: "67%", icon: MessageSquare, color: "text-emerald-400" },
              { label: "Freshness", value: "58%", icon: Zap, color: "text-amber-400" },
              { label: "Coverage", value: "64%", icon: Activity, color: "text-pink-400" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    {metric.label}
                  </div>
                  <div className="text-3xl font-semibold">{metric.value}</div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-zinc-400" />
                Current Scores
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CURRENT_SCORES} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-zinc-400" />
                Score Over Time
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={OVERTIME_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Visibility" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Accuracy" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sentiment" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
