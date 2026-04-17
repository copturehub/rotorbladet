'use client'

import Link from 'next/link'

interface CategoryBadgeProps {
  category: string
  categoryColors: Record<string, string>
}

export function CategoryBadge({ category, categoryColors }: CategoryBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/kategori/${category.toLowerCase()}`
  }

  return (
    <span
      onClick={handleClick}
      data-category={category}
      className={`category-badge px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r ${
        categoryColors[category] || 'from-slate-500 to-slate-600'
      } cursor-pointer hover:opacity-80 transition-opacity`}
    >
      {category}
    </span>
  )
}
