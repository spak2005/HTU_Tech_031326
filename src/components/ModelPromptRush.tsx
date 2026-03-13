import { useEffect, useMemo, useState } from 'react'

const MODELS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'claude', label: 'Claude' },
  { id: 'copilot', label: 'Copilot' },
]

const PROMPT_SNIPPETS = [
  'best laptops under $1000',
  'top business laptops 2026',
  'best creator laptop battery life',
  'durable laptops for students',
  'best workstation for engineering',
  'best lightweight work laptop',
  'best laptop for AI development',
  'best secure enterprise laptop',
]

interface ModelPromptRushProps {
  companyName: string
  onComplete?: () => void
}

export default function ModelPromptRush({ companyName, onComplete }: ModelPromptRushProps) {
  const [promptCount, setPromptCount] = useState(0)
  const [snippetIndex, setSnippetIndex] = useState(0)

  useEffect(() => {
    let snippetTimer: ReturnType<typeof setInterval>

    const promptTimer = setInterval(() => {
      setPromptCount(prev => {
        if (prev >= 100) {
          clearInterval(promptTimer)
          clearInterval(snippetTimer)
          onComplete?.()
          return 100
        }
        return prev + 1
      })
    }, 35)

    snippetTimer = setInterval(() => {
      setSnippetIndex(prev => (prev + 1) % PROMPT_SNIPPETS.length)
    }, 160)

    return () => {
      clearInterval(promptTimer)
      clearInterval(snippetTimer)
    }
  }, [])

  const modelStats = useMemo(
    () =>
      MODELS.map((model, index) => ({
        ...model,
        prompts: Math.min(100, Math.floor(promptCount * (0.76 + index * 0.05))),
        responses: Math.min(100, Math.floor(promptCount * (0.67 + index * 0.05))),
      })),
    [promptCount],
  )
  const currentModel = MODELS[promptCount % MODELS.length]
  const currentPrompt = PROMPT_SNIPPETS[snippetIndex]

  return (
    <section className="mx-auto max-w-[1500px] rounded-2xl border border-border bg-surface p-6 lg:p-10">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-text-heading lg:text-4xl">Model Prompt Blitz</h2>
        <p className="mt-2 text-base text-text">
          Running a high-speed 100-prompt sweep across 5 models for {companyName}
        </p>
      </header>

      <div className="rounded-xl border border-primary/25 bg-surface-alt p-6 lg:p-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wider text-text">
            Active model: <span className="text-primary">{currentModel.label}</span>
          </span>
          <span className="text-xl font-bold text-text-heading lg:text-2xl">{promptCount} / 100</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-300/45 dark:bg-slate-700/55">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-75 shadow-[0_0_16px_rgba(85,17,56,0.55)]"
            style={{ width: `${promptCount}%` }}
          />
        </div>

        <div className="mt-6 flex min-h-[34vh] items-center justify-center rounded-xl border border-border bg-bg/70 p-6 text-center">
          <p className="max-w-[1150px] font-sans text-3xl font-black leading-tight tracking-tight text-text-heading lg:text-6xl xl:text-7xl">
            {currentPrompt}
          </p>
        </div>

        <p className="mt-4 font-mono text-sm text-text">
          Broadcasting prompts across all models at high throughput...
        </p>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        {modelStats.map(model => (
          <article key={model.id} className="rounded-xl border border-border bg-surface-alt p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-heading">{model.label}</h3>
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-3 space-y-1.5 text-base text-text">
              <p>
                Prompts: <span className="font-bold text-text-heading">{model.prompts}</span>
              </p>
              <p>
                Responses: <span className="font-bold text-text-heading">{model.responses}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
