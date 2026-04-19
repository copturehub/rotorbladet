'use client'

import { useEffect, useState } from 'react'

function formatRelative(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just nu'
  if (minutes < 60) return `${minutes}m sedan`
  if (hours < 24) return `${hours}h sedan`
  if (days < 7) return `${days}d sedan`
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

export function RelativeTime({ dateString }: { dateString: string }) {
  const [label, setLabel] = useState(() => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
  })

  useEffect(() => {
    const date = new Date(dateString)
    setLabel(formatRelative(date))

    const interval = setInterval(() => {
      setLabel(formatRelative(date))
    }, 60000)

    return () => clearInterval(interval)
  }, [dateString])

  return (
    <time dateTime={dateString} className="text-xs text-slate-500 font-medium tabular-nums">
      {label}
    </time>
  )
}
