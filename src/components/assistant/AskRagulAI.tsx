import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import {
  answerQuestion,
  assistantGreeting,
  generalSuggestions,
  projectSuggestions,
} from '../../lib/assistant'
import type { AssistantMode } from '../../lib/assistant'

import './AskRagulAI.css'

export interface AssistantState {
  open: boolean
  mode: AssistantMode
}

interface AskRagulAIProps {
  state: AssistantState
  setState: Dispatch<SetStateAction<AssistantState>>
}

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

let messageId = 0

export function AskRagulAI({ state, setState }: AskRagulAIProps) {
  const { open, mode } = state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const sessionModeRef = useRef<AssistantMode | null>(null)
  const timerRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useBodyScrollLock(open)

  // Reset the conversation whenever the assistant is opened in a new mode.
  useEffect(() => {
    if (!open) return

    if (sessionModeRef.current !== mode) {
      sessionModeRef.current = mode
      messageId = 0
      setMessages([
        { id: messageId++, role: 'assistant', text: assistantGreeting[mode] },
      ])
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 320)
    return () => window.clearTimeout(focusTimer)
  }, [open, mode])

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setState((prev) => ({ ...prev, open: false }))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setState])

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  // Clear pending timers on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const suggestions = mode === 'project' ? projectSuggestions : generalSuggestions

  const send = (text: string) => {
    const question = text.trim()
    if (!question || thinking) return

    setMessages((prev) => [
      ...prev,
      { id: messageId++, role: 'user', text: question },
    ])
    setInput('')
    setThinking(true)

    // Small local delay to mimic retrieval — no network calls happen.
    timerRef.current = window.setTimeout(() => {
      const answer = answerQuestion(question, mode)
      setMessages((prev) => [
        ...prev,
        { id: messageId++, role: 'assistant', text: answer.text },
      ])
      setThinking(false)
      timerRef.current = null
    }, 420)
  }

  return (
    <>
      {/* Floating action button */}
      <motion.button
        type="button"
        className={`assistant-fab ${open ? 'is-open' : ''}`}
        onClick={() => setState((prev) => ({ ...prev, open: !prev.open }))}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? 'Close Ask Ragul AI' : 'Open Ask Ragul AI'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="assistant-fab-ring" aria-hidden="true" />
        {open ? <X size={20} /> : <Bot size={20} />}
        <span className="assistant-fab-label">
          {open ? 'Close' : 'Ask Ragul AI'}
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="assistant-panel"
            className="assistant-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Ask Ragul AI portfolio assistant"
            initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(10px)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <header className="assistant-head">
              <span className="assistant-avatar" aria-hidden="true">
                <Sparkles size={16} />
              </span>

              <div className="assistant-head-text">
                <h3>ASK RAGUL AI</h3>
                <p>
                  {mode === 'project'
                    ? 'Market AI Tracker mode'
                    : 'Portfolio assistant'}
                </p>
              </div>

              <span className="assistant-demo-chip">Local demo</span>

              <button
                type="button"
                className="assistant-close"
                onClick={() => setState((prev) => ({ ...prev, open: false }))}
                aria-label="Close assistant"
              >
                <X size={17} />
              </button>
            </header>

            {/* Messages */}
            <div
              className="assistant-messages"
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`assistant-message is-${message.role}`}
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="assistant-message-role" aria-hidden="true">
                    {message.role === 'assistant' ? <Bot size={13} /> : 'YOU'}
                  </span>
                  <p>{message.text}</p>
                </motion.div>
              ))}

              {thinking ? (
                <div className="assistant-thinking" aria-label="Retrieving answer">
                  <span />
                  <span />
                  <span />
                </div>
              ) : null}
            </div>

            {/* Suggestions */}
            <div className="assistant-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  disabled={thinking}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              className="assistant-input-row"
              onSubmit={(event) => {
                event.preventDefault()
                send(input)
              }}
            >
              <label className="sr-only" htmlFor="assistant-input">
                Ask a question about this portfolio
              </label>
              <input
                ref={inputRef}
                id="assistant-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about projects, skills, internships..."
                autoComplete="off"
                disabled={thinking}
              />
              <button
                type="submit"
                aria-label="Send question"
                disabled={thinking || !input.trim()}
              >
                <Send size={16} />
              </button>
            </form>

            <p className="assistant-footnote">
              Answers are retrieved locally from verified portfolio data — no
              external AI API, no API keys. Built RAG-ready for a Flask/Node
              backend.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
