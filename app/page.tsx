'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, Download, PlayCircle, PauseCircle, MessageSquarePlus } from 'lucide-react'

const voices = [
  { name: 'mrbeast', label: 'Mr Beast' },
  { name: 'jamie', label: 'Jamie' },
  { name: 'snoop', label: 'Snoop' },
  { name: 'henry', label: 'Henry' },
  { name: 'gwyneth', label: 'Gwyneth' },
  { name: 'cliff', label: 'Cliff' },
  { name: 'narrator', label: 'Narrator' },
]

export default function TextToSpeech() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('mrbeast')
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const audioRefs = useRef({})
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handlePlayPause = (messageId) => {
    const audio = audioRefs.current[messageId]
    
    if (currentlyPlaying && currentlyPlaying !== messageId) {
      audioRefs.current[currentlyPlaying].pause()
    }
    
    if (audio.paused) {
      audio.play()
      setCurrentlyPlaying(messageId)
    } else {
      audio.pause()
      setCurrentlyPlaying(null)
    }
  }

  const handleAudioEnded = (messageId) => {
    setCurrentlyPlaying(null)
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    const newMessage = { type: 'user', content: inputText }
    setMessages([...messages, newMessage, { type: 'loading' }])
    setInputText('')
    scrollToBottom()

    try {
      const response = await fetch("https://audio.api.speechify.com/generateAudioFiles", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioFormat: "mp3",
          paragraphChunks: [inputText],
          voiceParams: {
            name: selectedVoice,
            engine: "speechify",
            languageCode: "en-US"
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const audioSrc = `data:audio/mp3;base64,${data.audioStream}`
      const messageId = Date.now().toString()
      
      setMessages(prev => [...prev.slice(0, -1), { id: messageId, type: 'bot', content: audioSrc }])

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev.slice(0, -1), { type: 'error', content: 'Failed to generate audio. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (audioSrc) => {
    const link = document.createElement('a')
    link.href = audioSrc
    link.download = 'speech.mp3'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNewChat = () => {
    setMessages([])
    setInputText('')
    setCurrentlyPlaying(null)
    Object.values(audioRefs.current).forEach(audio => audio.pause())
    audioRefs.current = {}
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* App Bar */}
      <header className="border-b bg-background p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Era Speak</h1>
        <Button variant="default" className="rounded-full" onClick={handleNewChat}>
          New Chat
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquarePlus className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Let's Get Started!</h2>
            <p className="text-gray-500">Type a message below to begin your conversation.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id || index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${
                message.type === 'user' ? 'bg-primary text-primary-foreground' : 
                message.type === 'error' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary'
              }`}>
                {message.type === 'user' ? (
                  <p>{message.content}</p>
                ) : message.type === 'error' ? (
                  <p>{message.content}</p>
                ) : message.type === 'loading' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handlePlayPause(message.id)}
                      className="h-8 w-8"
                    >
                      {currentlyPlaying === message.id ? 
                        <PauseCircle className="h-8 w-8" /> : 
                        <PlayCircle className="h-8 w-8" />
                      }
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDownload(message.content)}
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <audio
                      ref={el => audioRefs.current[message.id] = el}
                      src={message.content}
                      onEnded={() => handleAudioEnded(message.id)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Container */}
      <footer className="border-t bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex flex-col space-y-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="pr-24 py-6"
            />
            <div className="flex items-center justify-between">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-[120px] h-10">
                  <SelectValue placeholder="Voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSend} 
                disabled={isLoading} 
                size="default"
                className="h-10"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
        }
