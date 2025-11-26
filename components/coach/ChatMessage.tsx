'use client'

/**
 * Chat Message Bubble Component
 * Displays user or AI assistant messages with appropriate styling
 * Parses [[ARTICLE:title|url]] format into clickable cards
 */

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { User, ExternalLink, BookOpen } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  userProfilePicture?: string | null
}

interface ArticleLink {
  title: string
  url: string
}

/**
 * Parse content and extract article links
 * Format: [[ARTICLE:title|url]]
 * Also handles fallback for markdown links [text](url) from testograph.eu
 */
function parseContent(content: string): { text: string; articles: ArticleLink[] } {
  const articles: ArticleLink[] = []
  let processedContent = content

  // 1. Extract [[ARTICLE:title|url]] format (preferred)
  const articleRegex = /\[\[ARTICLE:([^|]+)\|([^\]]+)\]\]/g
  let match
  while ((match = articleRegex.exec(content)) !== null) {
    const url = match[2].trim()
    // Only accept testograph.eu/learn URLs
    if (url.includes('testograph.eu/learn')) {
      articles.push({
        title: match[1].trim(),
        url: url,
      })
    }
  }
  processedContent = processedContent.replace(articleRegex, '')

  // 2. Fallback: Extract markdown links [text](url) for testograph.eu/learn only
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+testograph\.eu\/learn[^)]*)\)/g
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const title = match[1].trim()
    const url = match[2].trim()
    // Avoid duplicates
    if (!articles.some(a => a.url === url)) {
      articles.push({ title, url })
    }
  }
  processedContent = processedContent.replace(markdownLinkRegex, '')

  // 3. Clean up any remaining broken/invalid links (not from testograph.eu/learn)
  // Remove markdown links to non-learn pages
  processedContent = processedContent.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')

  // 4. Clean up any raw URLs that might have leaked through
  processedContent = processedContent.replace(/https?:\/\/[^\s]+/g, '')

  // 5. Clean up extra whitespace and newlines
  processedContent = processedContent.replace(/\n{3,}/g, '\n\n').trim()

  return { text: processedContent, articles }
}

/**
 * Article Card Component
 */
function ArticleCard({ title, url }: ArticleLink) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 mt-2 bg-background/80 hover:bg-background border border-border rounded-xl transition-all duration-200 hover:shadow-md group"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground">testograph.eu/learn</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  )
}

export function ChatMessage({ role, content, isStreaming, userProfilePicture }: ChatMessageProps) {
  const isUser = role === 'user'

  // Parse content for article links (only for assistant messages)
  const { text, articles } = isUser ? { text: content, articles: [] } : parseContent(content)

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
          {text}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </p>

        {/* Article Cards */}
        {articles.length > 0 && (
          <div className="mt-2 space-y-2">
            {articles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
