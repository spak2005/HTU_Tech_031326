import { useEffect, useRef } from 'react'

interface Agent {
  id: string
  name: string
  icon: string
}

interface VisibleEvent {
  agent: string
  renderedLine: string
}

function StatusIndicator({ state }: { state: string }) {
  if (state === 'done') {
    return (
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
        ✓
      </span>
    )
  }

  if (state === 'active') {
    return <span className="h-3.5 w-3.5 rounded-full bg-[#c73e88] animate-pulse shadow-[0_0_8px_rgba(199,62,136,0.5)]" />
  }

  return <span className="h-3.5 w-3.5 rounded-full bg-zinc-600" />
}

interface AgentFeedProps {
  agents: Agent[]
  agentStates: Record<string, string>
  visibleEvents: VisibleEvent[]
}

export default function AgentFeed({ agents, agentStates, visibleEvents }: AgentFeedProps) {
  const bottomAnchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [visibleEvents.length])

  return (
    <section className="h-full rounded-2xl border border-[#551138]/30 bg-[#0e0610] text-zinc-100 shadow-[0_4px_32px_rgba(85,17,56,0.15)]">
      <div className="border-b border-[#551138]/20 px-4 py-4 lg:px-5">
        <h2 className="text-lg font-semibold text-white">Agent Activity Feed</h2>
        <p className="mt-1 text-xs text-[#c73e88]/60">Live terminal stream</p>
      </div>

      <div className="border-b border-[#551138]/20 px-4 py-4 lg:px-5">
        <ul className="space-y-2">
          {agents.map(agent => (
            <li
              key={agent.id}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors duration-300 ${
                agentStates[agent.id] === 'active'
                  ? 'bg-[#551138]/20 border border-[#551138]/30'
                  : 'bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className="font-mono text-sm">
                {agent.icon} {agent.name}
              </span>
              <StatusIndicator state={agentStates[agent.id]} />
            </li>
          ))}
        </ul>
      </div>

      <div aria-live="polite" className="h-[46vh] min-h-[320px] overflow-y-auto px-4 py-4 font-mono text-sm lg:px-5">
        <ul className="space-y-2">
          {visibleEvents.map((event, index) => (
            <li
              key={`${event.agent}-${index}`}
              className="rounded-lg border border-[#551138]/15 bg-[#551138]/[0.06] px-3 py-2 text-zinc-300 animate-[fadeup_.35s_ease-out]"
            >
              {event.renderedLine}
            </li>
          ))}
        </ul>
        <div ref={bottomAnchorRef} />
      </div>
    </section>
  )
}
