'use client'

import React, { useEffect, useRef } from 'react'

interface NewsTickerProps {
  articles: { title: string; original_url?: string; id: string }[]
}

export function NewsTicker({ articles }: NewsTickerProps) {
  if (articles.length === 0) return null

  const items = [...articles, ...articles]

  return (
    <div className="bg-slate-950 border-b border-slate-800 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-600 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
            Senaste
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-track flex items-center gap-0">
            {items.map((article, i) => (
              <a
                key={`${article.id}-${i}`}
                href={article.original_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-3 px-6 py-2.5 text-xs text-slate-300 hover:text-white transition-colors whitespace-nowrap group"
              >
                <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                <span className="group-hover:underline underline-offset-2">{article.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
