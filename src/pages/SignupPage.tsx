import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    signup(email)
    navigate('/onboarding')
  }

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center px-6 py-16 overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl -top-48 -right-32 dark:opacity-[0.06]" />
      <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-[#a02468]/15 blur-3xl bottom-[-10%] -left-32 dark:opacity-[0.05]" />

      <div className="relative w-full max-w-md" style={{ animation: 'fadeup 0.6s ease-out both' }}>
        <div className="rounded-2xl border border-border bg-surface p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <img src="/arcana-logo.png" alt="ArcanAI" className="mx-auto mb-5 h-12 w-12 rounded-full object-cover shadow-lg shadow-primary/25" />
            <h1 className="text-2xl font-bold text-text-heading tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-text">Start optimizing your AI presence today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-heading mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-heading mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 cursor-pointer"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text">
            Already have an account?{' '}
            <Link to="/" className="text-primary hover:underline font-medium">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
