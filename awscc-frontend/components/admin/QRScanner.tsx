'use client'

import { useEffect, useRef, useState } from 'react'
import { checkIn } from '@/lib/api'
import type { CheckInResponse } from '@/lib/types'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function QRScanner() {
  const scannerRef  = useRef<InstanceType<typeof import('html5-qrcode').Html5Qrcode> | null>(null)
  const [scanning, setScanning]   = useState(false)
  const [result, setResult]       = useState<CheckInResponse | null>(null)
  const [error, setError]         = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [scanning])

  async function startScanner() {
    const { Html5Qrcode } = await import('html5-qrcode')
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner
    setResult(null)
    setError('')

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (processing) return
          setProcessing(true)
          await scanner.stop()
          setScanning(false)

          // Extract token from URL or use raw value
          const tokenMatch = decodedText.match(/checkin\/([a-f0-9-]{36})/i)
          const token = tokenMatch ? tokenMatch[1] : decodedText.trim()

          try {
            const res = await checkIn(token)
            setResult(res)
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Check-in failed')
          } finally {
            setProcessing(false)
          }
        },
        () => {} // silent QR parse errors
      )
      setScanning(true)
    } catch {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {})
      setScanning(false)
    }
  }

  function reset() {
    setResult(null)
    setError('')
  }

  return (
    <div className="space-y-4">
      {/* Scanner viewport */}
      <div className="rounded-2xl overflow-hidden bg-brand-dark" style={{ minHeight: 300 }}>
        <div id="qr-reader" className="w-full" />
        {!scanning && !result && (
          <div className="flex items-center justify-center h-72">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">📷</span>
              </div>
              <p className="text-white/60 text-sm">Camera inactive</p>
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl p-5 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-start gap-3">
            {result.success
              ? <CheckCircle size={22} className="text-green-500 flex-shrink-0 mt-0.5" />
              : <AlertCircle size={22} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            }
            <div className="flex-1">
              <p className={`font-semibold text-base ${result.success ? 'text-green-800' : 'text-yellow-800'}`}>
                {result.message}
              </p>
              {result.registration && (
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {result.registration.full_name}</p>
                  <p><span className="font-medium">Email:</span> {result.registration.email}</p>
                  {result.registration.university && (
                    <p><span className="font-medium">University:</span> {result.registration.university}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Error */}
      {error && (
        <div className="rounded-2xl p-4 bg-red-50 border border-red-200 flex items-center gap-3">
          <XCircle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!scanning ? (
          <button
            onClick={startScanner}
            disabled={processing}
            className="flex-1 bg-brand-dark text-white font-medium py-3 rounded-full
                       hover:bg-brand-navy transition-colors disabled:opacity-60 text-sm"
          >
            {processing ? 'Processing…' : '📷 Start Scanner'}
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex-1 bg-red-500 text-white font-medium py-3 rounded-full hover:bg-red-600 transition-colors text-sm"
          >
            ⏹ Stop Scanner
          </button>
        )}
        {(result || error) && (
          <button
            onClick={reset}
            className="px-5 py-3 border border-gray-200 text-gray-600 rounded-full text-sm hover:border-gray-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
