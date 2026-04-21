'use client'

import React, { useState } from 'react'

interface AdminControlsProps {
  articleId: string
  isFeatured: boolean
  onFeaturedToggle: () => void
  onDelete: () => void
  onEdit: () => void
}

export function AdminControls({
  articleId,
  isFeatured,
  onFeaturedToggle,
  onDelete,
  onEdit,
}: AdminControlsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFeatured = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`/api/articles/${articleId}/toggle-featured`, {
        method: 'POST',
      })

      if (res.ok) {
        onFeaturedToggle()
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (confirm('Är du säker på att du vill ta bort denna artikel?')) {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          onDelete()
        } else {
          alert('Kunde inte ta bort artikeln')
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Ett fel uppstod vid borttagning')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
      <button
        onClick={handleToggleFeatured}
        disabled={isLoading}
        className={`p-2 rounded-lg backdrop-blur-md transition-all ${
          isFeatured
            ? 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30'
            : 'bg-slate-100/80 text-slate-400 hover:bg-slate-200/80 hover:text-slate-600'
        }`}
        title={isFeatured ? 'Ta bort från utvalda' : 'Lägg till i utvalda'}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`}
            fill={isFeatured ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        )}
      </button>

      <button
        onClick={onEdit}
        className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-md text-slate-400 hover:bg-slate-200/80 hover:text-slate-600 transition-all"
        title="Redigera"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="p-2 rounded-lg bg-slate-100/80 backdrop-blur-md text-slate-400 hover:bg-red-100/80 hover:text-red-600 transition-all disabled:opacity-50"
        title="Ta bort"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
