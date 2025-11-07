'use client'

/**
 * Login Page
 * User login with email and password from welcome email
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        // Already logged in
        const userEmail = data.session.user.email
        if (userEmail) {
          localStorage.setItem('quizEmail', userEmail)
          router.push('/app')
        }
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Грешен email или парола')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      if (data.session) {
        // Login successful - save email to localStorage
        localStorage.setItem('quizEmail', email)

        // Redirect to app
        router.push('/app')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Възникна грешка при влизане')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Влез в Testograph</h1>
          <p className="text-slate-400">
            Използвай email-а и паролата от welcome имейла
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="твоят-email@gmail.com"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Парола
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Паролата е изпратена на твоя email след попълване на теста
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Влизане...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Влез
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-slate-400">
            Нямаш акаунт?{' '}
            <Link
              href="/quiz"
              className="text-amber-500 hover:text-amber-400 font-medium"
            >
              Попълни теста
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Ако не си получил парола, провери SPAM папката или{' '}
            <a
              href="mailto:support@testograph.com"
              className="text-amber-500 hover:underline"
            >
              свържи се с нас
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
