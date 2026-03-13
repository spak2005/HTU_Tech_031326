import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Track',
    description:
      'Monitor how your brand appears across major AI models with a real-time AIO Score measuring visibility, accuracy, sentiment, and more.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    ),
    gradient: 'from-[#551138]/10 to-[#a02468]/10',
    borderHover: 'hover:border-[#7a1a52]/40',
    iconBg: 'bg-[#551138]/10 text-[#551138] dark:text-[#c73e88]',
  },
  {
    title: 'Improve',
    description:
      'Get actionable recommendations when gaps or inaccuracies are detected — from content updates to product description rewrites.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    gradient: 'from-emerald-500/10 to-teal-500/10',
    borderHover: 'hover:border-emerald-400/40',
    iconBg: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
  },
  {
    title: 'Launch',
    description:
      'Run AI readiness scans for new products, generate optimized content, and feed results back into the Track loop for continuous improvement.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderHover: 'hover:border-amber-400/40',
    iconBg: 'bg-amber-500/10 text-amber-500 dark:text-amber-400',
  },
]

const logos = ['ChatGPT', 'Perplexity', 'Gemini', 'Claude', 'Copilot']

function GradientOrb({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-20 dark:opacity-[0.07] ${className}`}
    />
  )
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background orbs */}
      <GradientOrb className="w-[600px] h-[600px] bg-[#551138] -top-48 -right-48" />
      <GradientOrb className="w-[500px] h-[500px] bg-[#a02468] top-[40%] -left-64" />
      <GradientOrb className="w-[400px] h-[400px] bg-primary top-[75%] right-[-10%]" />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 md:pt-40 md:pb-32">
        <div
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm font-medium bg-surface border border-border shadow-sm"
          style={{ animation: 'fadeup 0.6s ease-out both' }}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-text">AI Optimization Platform</span>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-text-heading tracking-tight leading-[1.08] max-w-5xl"
          style={{ animation: 'fadeup 0.7s ease-out 0.1s both' }}
        >
          Take control of your
          <span className="relative">
            <span className="bg-gradient-to-r from-primary via-[#c73e88] to-primary bg-clip-text text-transparent"> AI presence</span>
          </span>
        </h1>

        <p
          className="mt-7 text-lg md:text-xl text-text max-w-2xl leading-relaxed"
          style={{ animation: 'fadeup 0.7s ease-out 0.2s both' }}
        >
          AI assistants answer shopping questions directly. ArcanAI monitors how
          your brand appears across every major model, so you never lose a sale
          to bad data.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          style={{ animation: 'fadeup 0.7s ease-out 0.3s both' }}
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary-dark transition-all duration-200"
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Social proof strip */}
        <div
          className="mt-20 flex flex-col items-center gap-4"
          style={{ animation: 'fadeup 0.7s ease-out 0.45s both' }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-text/60">
            Monitoring across
          </p>
          <div className="flex items-center gap-6 md:gap-8">
            {logos.map(name => (
              <span
                key={name}
                className="text-sm font-semibold text-text/40 transition-colors hover:text-text/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.14em] bg-accent-bg text-primary border border-accent-border">
              How it works
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-text-heading tracking-tight">
              Three pillars of AI Optimization
            </h2>
            <p className="mt-4 text-text max-w-2xl mx-auto text-lg leading-relaxed">
              ArcanAI gives businesses the tools to monitor, correct, and
              strengthen their presence across every major AI model.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border border-border bg-surface p-7 lg:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] dark:hover:shadow-black/20 hover:-translate-y-0.5 ${feature.borderHover}`}
                style={{ animation: `fadeup 0.6s ease-out ${0.1 + index * 0.1}s both` }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-heading mb-2.5 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-text leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: '5', label: 'AI Models Tracked' },
                { value: '100+', label: 'Prompts Per Scan' },
                { value: '< 60s', label: 'Full Analysis Time' },
                { value: '4', label: 'Core Health Metrics' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-text-heading tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-sm text-text">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-heading tracking-tight">
            Ready to optimize your
            <span className="bg-gradient-to-r from-primary to-[#c73e88] bg-clip-text text-transparent"> AI presence</span>?
          </h2>
          <p className="mt-5 text-text text-lg leading-relaxed max-w-xl mx-auto">
            Join the businesses already taking control of how AI represents
            their brand.
          </p>
          <Link
            to="/signup"
            className="group mt-10 inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary-dark transition-all duration-200"
          >
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-text-heading">ArcanAI</span>
            <img src="/arcana-logo.png" alt="ArcanAI" className="h-7 w-7 rounded-full object-cover" />
          </div>
          <p className="text-sm text-text">
            &copy; {new Date().getFullYear()} ArcanAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
