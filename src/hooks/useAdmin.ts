'use client'

import { useState, useEffect } from 'react'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/check')
        const data = await res.json()
        setIsAdmin(data.admin === true)
      } catch {
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [])

  return { isAdmin, isLoading }
}
