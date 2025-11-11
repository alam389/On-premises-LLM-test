import React, { useState, useRef, useEffect } from 'react';
import { chatService, StreamChunk, ApiError } from '../api';

interface Message {
  content: string;
  isUser: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [isSending, setIsSending] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isSending) return;

    // Add user message
    setMessages((prev: Message[]) => [...prev, { content: trimmedPrompt, isUser: true }]);
    setPrompt('');
    setIsSending(true);

    // Create assistant message container
    let assistantMessage = '';
    const assistantMessageIndex = messages.length + 1;

    try {
      await chatService.streamChat(
        { prompt: trimmedPrompt, model: selectedModel },
        (chunk: StreamChunk) => {
          if (chunk.content) {
            assistantMessage += chunk.content;
            // Update the message in real-time
            setMessages((prev: Message[]) => {
              const updated = [...prev];
              if (updated[assistantMessageIndex]) {
                updated[assistantMessageIndex] = {
                  content: assistantMessage,
                  isUser: false,
                };
              } else {
                updated.push({
                  content: assistantMessage,
                  isUser: false,
                });
              }
              return updated;
            });
          }
          if (chunk.done) {
            setIsSending(false);
          }
        },
        (error: ApiError) => {
          setMessages((prev: Message[]) => [
            ...prev,
            { content: `Error: ${error.message}`, isUser: false },
          ]);
          setIsSending(false);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev: Message[]) => [
        ...prev,
        { content: `Error: ${errorMessage}`, isUser: false },
      ]);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="header">
        <h1>Ollama Chat</h1>
      </div>
      
      <div className="container">
        <div className="chat-area" ref={chatAreaRef}>
          {messages.map((message: Message, index: number) => (
            <div
              key={index}
              className={`message ${message.isUser ? 'user-message' : 'assistant-message'}`}
            >
              {message.content}
            </div>
          ))}
        </div>
        
        <div className="input-area">
          <select
            className="model-select"
            value={selectedModel}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value)}
            disabled={isSending}
          >
            <option value="llama2">llama2</option>
            <option value="llama3">llama3</option>
            <option value="mistral">mistral</option>
            <option value="codellama">codellama</option>
          </select>
          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isSending || !prompt.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
