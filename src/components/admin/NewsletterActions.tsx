'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export default function NewsletterActions() {
  const { id } = useDocumentInfo()
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )
  const [testEmail, setTestEmail] = useState('')
  const [showTestInput, setShowTestInput] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!id) {
    return (
      <div style={styles.container}>
        <p style={styles.info}>Spara nyhetsbrevet först för att kunna förhandsgranska och skicka.</p>
      </div>
    )
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handlePreview = () => {
    window.open(`/api/newsletters/${id}/preview`, '_blank')
  }

  const handleSendTest = async () => {
    if (!testEmail) {
      showMessage('error', 'Ange en e-postadress')
      return
    }
    setLoading('test')
    try {
      const res = await fetch(`/api/newsletters/${id}/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: testEmail }),
      })
      const data = await res.json()
      if (res.ok) {
        showMessage('success', data.message)
        setShowTestInput(false)
        setTestEmail('')
      } else {
        showMessage('error', data.error || 'Något gick fel')
      }
    } catch (err: any) {
      showMessage('error', err.message)
    }
    setLoading(null)
  }

  const handleSendAll = async () => {
    setLoading('send')
    try {
      const res = await fetch(`/api/newsletters/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        showMessage('success', data.message)
        setShowConfirm(false)
        setTimeout(() => window.location.reload(), 2000)
      } else {
        showMessage('error', data.error || 'Något gick fel')
      }
    } catch (err: any) {
      showMessage('error', err.message)
    }
    setLoading(null)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Åtgärder</h3>
        <p style={styles.subtitle}>Förhandsgranska och skicka nyhetsbrevet</p>
      </div>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.messageSuccess : styles.messageError),
          }}
        >
          {message.text}
        </div>
      )}

      <div style={styles.buttonRow}>
        <button type="button" onClick={handlePreview} style={styles.buttonSecondary}>
          <span style={styles.iconCircle}>👁</span>
          Förhandsgranska
        </button>

        <button
          type="button"
          onClick={() => setShowTestInput(!showTestInput)}
          style={styles.buttonSecondary}
          disabled={loading !== null}
        >
          <span style={styles.iconCircle}>✉</span>
          Skicka test
        </button>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          style={styles.buttonPrimary}
          disabled={loading !== null}
        >
          <span style={styles.iconCircle}>🚀</span>
          Skicka till alla
        </button>
      </div>

      {showTestInput && (
        <div style={styles.inlineForm}>
          <input
            type="email"
            placeholder="din@email.se"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            style={styles.input}
            disabled={loading === 'test'}
          />
          <button
            type="button"
            onClick={handleSendTest}
            disabled={loading === 'test'}
            style={styles.buttonPrimary}
          >
            {loading === 'test' ? 'Skickar...' : 'Skicka'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTestInput(false)
              setTestEmail('')
            }}
            style={styles.buttonGhost}
          >
            Avbryt
          </button>
        </div>
      )}

      {showConfirm && (
        <div style={styles.confirmBox}>
          <p style={styles.confirmText}>
            <strong>Bekräfta:</strong> Skicka nyhetsbrevet till alla aktiva prenumeranter?
            Detta går inte att ångra.
          </p>
          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={handleSendAll}
              disabled={loading === 'send'}
              style={styles.buttonDanger}
            >
              {loading === 'send' ? 'Skickar...' : 'Ja, skicka till alla'}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              style={styles.buttonGhost}
              disabled={loading === 'send'}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, var(--theme-elevation-50) 0%, var(--theme-elevation-100) 100%)',
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: 'var(--theme-elevation-500)',
  },
  info: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--theme-elevation-500)',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  iconCircle: {
    marginRight: '6px',
  },
  buttonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: 'var(--theme-success-500, #059669)',
    color: '#fff',
    transition: 'all 0.2s',
  },
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--theme-elevation-200)',
    background: 'var(--theme-elevation-0)',
    color: 'var(--theme-elevation-800)',
    transition: 'all 0.2s',
  },
  buttonGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: 'var(--theme-elevation-600)',
  },
  buttonDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: 'var(--theme-error-500, #dc2626)',
    color: '#fff',
  },
  inlineForm: {
    marginTop: '16px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '8px',
    background: 'var(--theme-elevation-0)',
    color: 'var(--theme-elevation-900)',
  },
  confirmBox: {
    marginTop: '16px',
    padding: '16px',
    border: '1px solid var(--theme-warning-300, #fbbf24)',
    background: 'var(--theme-warning-50, #fef3c7)',
    borderRadius: '8px',
  },
  confirmText: {
    margin: '0 0 12px',
    fontSize: '14px',
    color: 'var(--theme-elevation-900)',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    fontWeight: 500,
  },
  messageSuccess: {
    background: 'var(--theme-success-50, #ecfdf5)',
    color: 'var(--theme-success-700, #047857)',
    border: '1px solid var(--theme-success-200, #a7f3d0)',
  },
  messageError: {
    background: 'var(--theme-error-50, #fef2f2)',
    color: 'var(--theme-error-700, #b91c1c)',
    border: '1px solid var(--theme-error-200, #fecaca)',
  },
}
