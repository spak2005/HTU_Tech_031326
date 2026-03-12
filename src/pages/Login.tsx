import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Check } from "lucide-react";

export default function Login() {
  const [step, setStep] = useState<"login" | "plans">("login");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("plans");
  };

  const selectPlan = () => {
    navigate("/track");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-50 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950"></div>
      
      <div className="relative z-10 w-full max-w-5xl">
        {step === "login" ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to Arcana</h1>
              <p className="text-zinc-400 text-sm mt-2">Sign in to your AI Optimization Platform</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <input 
                  type="email" 
                  required
                  defaultValue="demo@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <input 
                  type="password" 
                  required
                  defaultValue="password123"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              
              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight">Select your plan</h2>
              <p className="text-zinc-400 mt-2">Choose how you want to optimize your AI presence</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Trial */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-zinc-100">Free Trial</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-zinc-400">/30 days</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Basic monitoring
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> 1 Website
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Weekly reports
                  </li>
                </ul>
                <button 
                  onClick={selectPlan}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Start Free Trial
                </button>
              </div>

              {/* Standard */}
              <div className="bg-indigo-950/20 border border-indigo-500/50 rounded-2xl p-8 flex flex-col backdrop-blur-sm relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold text-zinc-100">Standard Plan</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-zinc-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Tracking + optimization tools
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> 5 Websites
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Daily reports
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Basic AI fixing suggestions
                  </li>
                </ul>
                <button 
                  onClick={selectPlan}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>

              {/* Premium */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-zinc-100">Premium Plan</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">$299</span>
                  <span className="text-zinc-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Full automation + launch optimization
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Unlimited Websites
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Real-time tracking
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400" /> Automated PR creation
                  </li>
                </ul>
                <button 
                  onClick={selectPlan}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
