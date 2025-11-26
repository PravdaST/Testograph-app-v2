'use client'

/**
 * Chat Message Bubble Component
 * Displays user or AI assistant messages with appropriate styling
 */

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  userProfilePicture?: string | null
}

export function ChatMessage({ role, content, isStreaming, userProfilePicture }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-message-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden',
          isUser ? 'bg-primary' : 'bg-gradient-to-br from-blue-500 to-purple-600'
        )}
      >
        {isUser ? (
          userProfilePicture ? (
            <Image
              src={userProfilePicture}
              alt="Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-primary-foreground" />
          )
        ) : (
          <Image
            src="/coach-avatar.png"
            alt="AI Coach"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'bg-muted rounded-tl-md'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </p>
      </div>
    </div>
  )
}
