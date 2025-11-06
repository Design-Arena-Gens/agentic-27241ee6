'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

const tools = [
  {
    name: 'Web Search',
    description: 'Search the web for information',
    icon: '🔍',
    action: 'search'
  },
  {
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    icon: '🧮',
    action: 'calculate'
  },
  {
    name: 'Weather',
    description: 'Get current weather information',
    icon: '🌤️',
    action: 'weather'
  },
  {
    name: 'Translator',
    description: 'Translate text between languages',
    icon: '🌐',
    action: 'translate'
  },
  {
    name: 'Code Helper',
    description: 'Help with coding problems',
    icon: '💻',
    action: 'code'
  },
  {
    name: 'Summarizer',
    description: 'Summarize long text',
    icon: '📝',
    action: 'summarize'
  }
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to AI Tool Agent! I can help you with various tasks using different tools.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleToolClick = (tool: typeof tools[0]) => {
    const toolMessage = `Use ${tool.name}: ${tool.description}`
    setInput(toolMessage)
  }

  const processMessage = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    // Simulate AI processing with different tools
    await new Promise(resolve => setTimeout(resolve, 1000))

    let response = ''
    let usedTool = ''

    if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
      usedTool = '🧮 Calculator Tool'
      const match = userMessage.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/)
      if (match) {
        const num1 = parseFloat(match[1])
        const op = match[2]
        const num2 = parseFloat(match[3])
        let result = 0
        switch(op) {
          case '+': result = num1 + num2; break
          case '-': result = num1 - num2; break
          case '*': result = num1 * num2; break
          case '/': result = num1 / num2; break
        }
        response = `Using ${usedTool}: ${num1} ${op} ${num2} = ${result}`
      } else {
        response = `Using ${usedTool}: I can help with calculations. Try asking me "what is 25 + 17?"`
      }
    } else if (lowerMessage.includes('weather')) {
      usedTool = '🌤️ Weather Tool'
      response = `Using ${usedTool}: The weather is currently sunny with a temperature of 72°F. (Demo mode - connect to a real weather API for live data)`
    } else if (lowerMessage.includes('translate')) {
      usedTool = '🌐 Translator Tool'
      response = `Using ${usedTool}: I can help translate text. For full functionality, connect to a translation API.`
    } else if (lowerMessage.includes('code') || lowerMessage.includes('program')) {
      usedTool = '💻 Code Helper Tool'
      response = `Using ${usedTool}: I can assist with coding questions. What programming language or problem are you working with?`
    } else if (lowerMessage.includes('search')) {
      usedTool = '🔍 Web Search Tool'
      response = `Using ${usedTool}: I would search the web for information. (Demo mode - connect to a search API for live results)`
    } else if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      usedTool = '📝 Summarizer Tool'
      response = `Using ${usedTool}: I can help summarize long texts. Please provide the text you'd like me to summarize.`
    } else {
      response = `I understand you want help with: "${userMessage}". I can assist using these tools: Web Search, Calculator, Weather, Translator, Code Helper, or Summarizer. Which would you like to use?`
    }

    return response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await processMessage(input)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'system',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🤖 AI Tool Agent</h1>
        <p>Your intelligent assistant powered by multiple AI tools</p>
      </header>

      <main className="main-content">
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="loading"></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="loading"></div> : 'Send'}
          </button>
        </form>
      </main>

      <section className="tools-section">
        <h2>Available Tools</h2>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="tool-card"
              onClick={() => handleToolClick(tool)}
            >
              <h3>{tool.icon} {tool.name}</h3>
              <p>{tool.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
