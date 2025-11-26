'use client'

/**
 * AI Coach Page
 * Personalized coaching chat interface
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, ArrowLeft, Wifi } from 'lucide-react'
import { useUserProgram } from '@/contexts/UserProgramContext'
import { BottomNav } from '@/components/navigation/BottomNav'
import { ChatMessage } from '@/components/coach/ChatMessage'
import { ChatInput } from '@/components/coach/ChatInput'
import { QuickActions } from '@/components/coach/QuickActions'
import { TypingIndicator } from '@/components/coach/TypingIndicator'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function CoachPage() {
  const router = useRouter()
  const { userProgram, email, loading: contextLoading } = useUserProgram()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history on mount
  useEffect(() => {
    if (email) {
      loadChatHistory()
    }
  }, [email])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChatHistory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/coach/history')

      if (!response.ok) {
        throw new Error('Failed to load chat history')
      }

      const data = await response.json()
      setMessages(
        data.messages.map((msg: { id: string; role: string; content: string }) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))
      )
    } catch (err) {
      console.error('Failed to load chat history:', err)
      setError('Грешка при зареждане на чата')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (isStreaming) return

    // Add user message immediately
    const userMessageId = `user-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: 'user', content },
    ])

    // Add placeholder for AI response
    const aiMessageId = `ai-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: 'assistant', content: '', isStreaming: true },
    ])
    setIsStreaming(true)
    setError(null)

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json()
          throw new Error(`Твърде много заявки. Изчакай ${data.resetIn || 60} секунди.`)
        }
        throw new Error('Failed to send message')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullContent += parsed.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: fullContent, isStreaming: true }
                        : msg
                    )
                  )
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      )
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(err instanceof Error ? err.message : 'Грешка при изпращане')

      // Remove the placeholder AI message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId))
    } finally {
      setIsStreaming(false)
    }
  }

  // Loading skeleton
  if (contextLoading || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="container-mobile flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">AI Коуч</h1>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wifi className="w-3 h-3" />
                  <span>Онлайн</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        <div className="container-mobile py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 h-16 rounded-2xl bg-muted animate-pulse" />
            </div>
          ))}
        </div>

        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container-mobile flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/app')}
              className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">AI Коуч</h1>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container-mobile py-4">
        <QuickActions onSelect={sendMessage} disabled={isStreaming} />
      </div>

      {/* Messages */}
      <div className="container-mobile pb-40 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Здравей!</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Аз съм твоят AI коуч. Избери тема отгоре или задай въпрос.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}

        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <TypingIndicator />
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-primary mt-2"
            >
              Затвори
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming}
        placeholder="Попитай ТестоКоуч..."
      />

      <BottomNav />
    </main>
  )
}
