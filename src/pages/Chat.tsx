import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import pb from '@/lib/pocketbase/client'
import { streamAgentChat, displayableMessages, type DisplayMessage } from '@/lib/skipAi'
import { Bot, User, Loader2, Plus, Mic, ChevronDown, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Chat() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toolCallNames = useRef<Record<string, string>>({})

  // Load previous conversations (simplification: just load latest if exists, or start new)
  useEffect(() => {
    const loadLatest = async () => {
      try {
        const res = await pb.send('/backend/v1/chats', { method: 'GET', query: { limit: 1 } })
        if (res?.items && res.items.length > 0) {
          const convId = res.items[0].id
          setConversationId(convId)
          const msgRes = await pb.send(`/backend/v1/chats/${convId}/messages`, { method: 'GET' })
          const msgs = Array.isArray(msgRes) ? msgRes : msgRes?.messages
          if (msgs) {
            setMessages(displayableMessages(msgs))
          }
        }
      } catch (err) {
        console.error('Failed to load chat history', err)
      }
    }
    loadLatest()
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')

    // Optimistic UI for user message
    const tempUserMsg: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      created: new Date().toISOString(),
    }

    const tempAsstMsg: DisplayMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      created: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempUserMsg, tempAsstMsg])
    setLoading(true)

    try {
      const abortCtrl = new AbortController()
      const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
        body: JSON.stringify({ message: userMsg, conversation_id: conversationId }),
        signal: abortCtrl.signal,
      })

      const result = await streamAgentChat(res, {
        onChunk: (_, fullText) => {
          setMessages((prev) => {
            const newArr = [...prev]
            newArr[newArr.length - 1].content = fullText
            return newArr
          })
        },
        onToolCallStart: (info) => {
          toolCallNames.current[info.id] = info.name
          if (info.name.includes('create_') || info.name.includes('update_')) {
            toast.loading('Salvando seu plano de ação...', { id: 'saving-plan' })
          }
        },
        onToolCallDone: (info) => {
          const name = toolCallNames.current[info.id] || ''
          if (name.includes('create_') || name.includes('update_')) {
            toast.dismiss('saving-plan')
            if (info.ok) {
              toast.success('Plano salvo com sucesso nos seus registros!', {
                description: 'Você pode visualizá-lo nas respectivas áreas do sistema.',
              })
            } else {
              toast.error('Ocorreu um erro ao tentar salvar o plano.')
            }
          }
        },
        signal: abortCtrl.signal,
      })

      setConversationId(result.conversation_id)

      // Final update
      setMessages((prev) => {
        const newArr = [...prev]
        newArr[newArr.length - 1].content = result.content
        newArr[newArr.length - 1].id = result.message_id
        return newArr
      })
    } catch (err: any) {
      toast.error(err.message || 'Falha ao conversar com o mentor.')
      // Remove temp assistant msg on error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="mb-4 shrink-0">
        <h1 className="ds-dash-title text-content flex items-center">
          <Bot className="w-8 h-8 mr-3 text-brand not-italic" /> Max AI
        </h1>
        <p className="text-content-muted mt-1">Seu Mentor Pragmático particular.</p>
      </div>

      <Card className="flex-1 flex flex-col bg-surface-1 border-border overflow-hidden relative shadow-lg rounded-xl">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20 text-content-dim">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Nenhuma mensagem ainda. Como posso ajudar a estruturar seus problemas hoje?</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-brand/10 border border-brand/20 mt-1">
                    <Bot className="w-4 h-4 text-brand" />
                  </div>
                )}
                <div
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}
                >
                  {msg.role === 'assistant' && (
                    <span className="text-xs text-content-muted mb-1.5 ml-1 font-medium">
                      Max AI
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm overflow-hidden ${
                      msg.role === 'user'
                        ? 'bg-brand text-white rounded-tr-sm'
                        : 'bg-surface-2 border border-border text-content rounded-tl-sm'
                    }`}
                  >
                    {msg.content === '' && msg.role === 'assistant' ? (
                      <div className="flex items-center gap-2 text-content-muted h-6">
                        <Loader2 className="w-4 h-4 animate-spin text-brand" />
                        <span className="text-sm">Pensando...</span>
                      </div>
                    ) : msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-surface-4 prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-code:bg-surface-3 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-headings:text-content prose-strong:text-content prose-a:text-brand hover:prose-a:text-brand-hover prose-blockquote:border-l-brand prose-blockquote:border-l-2 prose-blockquote:bg-brand/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-li:marker:text-content-muted">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 md:p-6 shrink-0 bg-surface-1 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-surface-2 border border-border rounded-xl p-2 md:p-3 flex flex-col gap-1 md:gap-2 relative shadow-sm focus-within:border-border-strong transition-all">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte ao Max AI..."
                  className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-content placeholder:text-content-dim shadow-none px-3 py-2 text-base md:text-sm"
                />
                <div className="flex items-center justify-between px-1 pb-1">
                  <button type="button" className="ghost-btn !p-2 !rounded-full text-content-muted">
                    <Plus className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="ghost-btn !px-3 !rounded-lg text-content-muted"
                    >
                      Build
                      <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
                    </button>
                    <button
                      type="button"
                      className="ghost-btn !p-2 !rounded-full text-content-muted"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="primary-btn !px-3 !rounded-lg ml-1 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}
