'use client'

/**
 * FormInput Component
 * Reusable input with validation states and error messages
 */

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  hint?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, success, hint, type = 'text', ...props }, ref) => {
    const hasError = !!error
    const hasSuccess = success && !hasError

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              'w-full px-3 py-2.5 rounded-xl border bg-background text-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'placeholder:text-muted-foreground/60',
              // Default state
              !hasError && !hasSuccess && 'border-border focus:border-primary focus:ring-primary/20',
              // Error state
              hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20 pr-10',
              // Success state
              hasSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500/20 pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {/* Status icon */}
          {hasError && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
          )}
          {hasSuccess && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
        </div>
        {/* Error message */}
        {hasError && (
          <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
            {error}
          </p>
        )}
        {/* Hint text */}
        {hint && !hasError && (
          <p className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

/**
 * FormTextarea Component
 * Reusable textarea with validation states
 */

import { TextareaHTMLAttributes } from 'react'

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: boolean
  hint?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, success, hint, ...props }, ref) => {
    const hasError = !!error
    const hasSuccess = success && !hasError

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            className={cn(
              'w-full px-3 py-2.5 rounded-xl border bg-background text-sm transition-all duration-200 resize-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'placeholder:text-muted-foreground/60',
              // Default state
              !hasError && !hasSuccess && 'border-border focus:border-primary focus:ring-primary/20',
              // Error state
              hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              // Success state
              hasSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {/* Error message */}
        {hasError && (
          <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
            {error}
          </p>
        )}
        {/* Hint text */}
        {hint && !hasError && (
          <p className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
