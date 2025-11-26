'use client'

/**
 * Typing Indicator Component
 * Shows animated dots when AI is responding
 */

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-message-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
        <img src="/coach-avatar.png" alt="К. Богданов" className="w-full h-full object-cover" />
      </div>

      {/* Typing Bubble */}
      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing-dot"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing-dot"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing-dot"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}
