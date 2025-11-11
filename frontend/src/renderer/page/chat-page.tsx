import React, { useState, useRef, useEffect } from 'react';
import { chatService, StreamChunk, ApiError } from '../api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { SendHorizontal, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Good evening. How may I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Create assistant message container
    let assistantMessage = '';
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessageIndex = messages.length + 1;

    try {
      await chatService.streamChat(
        { prompt: userMessage.content, model: 'llama2' },
        (chunk: StreamChunk) => {
          if (chunk.content) {
            assistantMessage += chunk.content;
            // Update the message in real-time
            setMessages((prev: Message[]) => {
              const updated = [...prev];
              if (updated[assistantMessageIndex]) {
                updated[assistantMessageIndex] = {
                  id: assistantMessageId,
                  role: 'assistant',
                  content: assistantMessage,
                  timestamp: new Date(),
                };
              } else {
                updated.push({
                  id: assistantMessageId,
                  role: 'assistant',
                  content: assistantMessage,
                  timestamp: new Date(),
                });
              }
              return updated;
            });
          }
          if (chunk.done) {
            setIsTyping(false);
          }
        },
        (error: ApiError) => {
          setMessages((prev: Message[]) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: `Error: ${error.message}`,
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `Error: ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Executive Assistant</h1>
              <p className="text-xs text-muted-foreground">Enterprise AI Platform</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            New Conversation
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-10 w-10 shrink-0 border border-border bg-card">
                    <div className="flex h-full w-full items-center justify-center">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Avatar>
                )}
                <Card
                  className={`max-w-[75%] border-border px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground'
                  }`}
                >
                  <p className="text-pretty leading-relaxed">{message.content}</p>
                  <p
                    className={`mt-2 text-xs ${
                      message.role === 'user'
                        ? 'text-primary-foreground/60'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Card>
                {message.role === 'user' && (
                  <Avatar className="h-10 w-10 shrink-0 border border-border bg-secondary">
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-secondary-foreground">
                      You
                    </div>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0 border border-border bg-card">
                  <div className="flex h-full w-full items-center justify-center">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Avatar>
                <Card className="border-border bg-card px-6 py-4">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Compose your inquiry..."
                className="h-14 w-full rounded-xl border border-input bg-background px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 h-10 w-10 shrink-0 rounded-lg p-0"
                disabled={!input.trim() || isTyping}
              >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Anthony  testing
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
