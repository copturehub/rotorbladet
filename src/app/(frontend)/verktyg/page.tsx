import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

export const revalidate = 0

const toolCategoryLabels: Record<string, { label: string; icon: string; color: string }> = {
  kartor: { label: 'Kartor & luftrum', icon: '🗺️', color: 'from-blue-500 to-cyan-500' },
  vader: { label: 'Väder', icon: '☁️', color: 'from-sky-400 to-blue-500' },
  regler: { label: 'Regler & tillstånd', icon: '⚖️', color: 'from-orange-500 to-red-500' },
  utbildning: {
    label: 'Utbildning & certifiering',
    icon: '📚',
    color: 'from-green-500 to-emerald-500',
  },
  verktyg: { label: 'Verktyg & appar', icon: '🛠️', color: 'from-purple-500 to-pink-500' },
  myndighet: {
    label: 'Myndigheter & organisationer',
    icon: '🏢',
    color: 'from-slate-600 to-slate-800',
  },
}

export default async function VerktygPage() {
  const payload = await getPayload({ config })
  const toolsRes = await payload.find({
    collection: 'tools',
    limit: 200,
    sort: '-createdAt',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools = toolsRes.docs as any[]

  // Group by tool_category
  const grouped: Record<string, typeof tools> = {}
  for (const tool of tools) {
    const cat = tool.tool_category || 'verktyg'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(tool)
  }

  const orderedCategories = [
    'kartor',
    'vader',
    'regler',
    'utbildning',
    'verktyg',
    'myndighet',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Rotorbladet
              </span>
              <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full uppercase tracking-wider">
                Beta
              </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full transition-colors"
              >
                Artiklar
              </Link>
              <Link
                href="/verktyg"
                className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full"
              >
                Verktyg
              </Link>
              <Link
                href="/prenumerera"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Prenumerera
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wider">
              Verktygslåda
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Tjänster & verktyg för drönarpiloter
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Handplockade karttjänster, väderappar, regelverk och verktyg som du använder på
              riktigt. Allt samlat på ett ställe.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tools.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-600 text-lg">
                Inga verktyg ännu – dyker upp snart.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {orderedCategories.map((catKey) => {
              const categoryTools = grouped[catKey]
              if (!categoryTools || categoryTools.length === 0) return null
              const meta = toolCategoryLabels[catKey]

              return (
                <section key={catKey}>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
                    <span className="text-3xl">{meta.icon}</span>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      {meta.label}
                    </h2>
                    <span className="ml-auto text-sm text-slate-500">
                      {categoryTools.length} st
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.map((tool) => {
                      let domain = tool.source
                      if (!domain && tool.url) {
                        try {
                          domain = new URL(tool.url).hostname.replace(/^www\./, '')
                        } catch {
                          domain = null
                        }
                      }

                      return (
                        <a
                          key={tool.id}
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all"
                        >
                          {tool.cover_url && (
                            <div className="relative overflow-hidden bg-slate-100 aspect-video">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={tool.cover_url}
                                alt={tool.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex flex-col flex-1 p-5">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-purple-700 transition-colors">
                              {tool.name}
                            </h3>
                            {tool.description && (
                              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                                {tool.description}
                              </p>
                            )}
                            {domain && (
                              <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 mt-auto border-t border-slate-100">
                                <span>🔗</span>
                                <span className="font-semibold text-slate-700 truncate">
                                  {domain}
                                </span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-900 transition-colors">
                                  Öppna →
                                </span>
                              </div>
                            )}
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-500">
          <p>
            Saknar du en tjänst?{' '}
            <Link href="/admin" className="text-purple-600 hover:text-purple-800 font-semibold">
              Lägg till i admin
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
