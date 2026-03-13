import { Outlet, Link, useLocation } from 'react-router-dom'
import { Activity, Wrench, Rocket } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../lib/utils'

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

const PUBLIC_ROUTES = ['/', '/signup', '/onboarding']

const navItems = [
  { path: '/analysis', label: 'Track', icon: Activity },
  { path: '/improve', label: 'Improve', icon: Wrench },
  { path: '/launch', label: 'Launch', icon: Rocket },
]

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isPublic = PUBLIC_ROUTES.includes(location.pathname)

  if (isPublic) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 lg:px-8 border-b border-border/60 bg-bg/80 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-lg font-semibold text-text-heading tracking-tight">
              ArcanAI
            </span>
            <img src="/arcana-logo.png" alt="ArcanAI" className="h-8 w-8 rounded-full object-cover" />
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text hover:text-text-heading hover:border-accent-border transition-all duration-200 cursor-pointer"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    )
  }

  // App routes (analysis, improve, launch)
  return (
    <div className="min-h-screen bg-bg text-text font-sans flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/analysis" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-text-heading">
            ArcanAI
            <img src="/arcana-logo.png" alt="ArcanAI" className="h-8 w-8 rounded-full object-cover" />
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text hover:text-text-heading hover:bg-surface-alt'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text hover:text-text-heading hover:border-accent-border transition-all duration-200 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center text-xs font-medium text-text-heading">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
