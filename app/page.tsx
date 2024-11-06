'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Image as ImageIcon, Loader2, ArrowLeft, Settings, Download } from "lucide-react"

const imageModelDetails = [
  { 
    name: "flux", 
    displayName: "Dekho General", 
    description: "High-quality image generation", 
    gradient: "from-blue-500 to-purple-500" 
  },
  { 
    name: "flux-realism", 
    displayName: "Dekho Realism", 
    description: "Realistic image generation", 
    gradient: "from-green-500 to-teal-500" 
  },
  { 
    name: "flux-cablyai", 
    displayName: "Dekho Artist", 
    description: "Abstract and artistic styles", 
    gradient: "from-red-500 to-yellow-500" 
  },
  { 
    name: "flux-anime", 
    displayName: "Dekho Anime", 
    description: "Anime-style image generation", 
    gradient: "from-pink-500 to-purple-500" 
  },
  { 
    name: "flux-3d", 
    displayName: "Dekho 3D", 
    description: "3D rendering and effects", 
    gradient: "from-indigo-500 to-blue-500" 
  },
  { 
    name: "any-dark", 
    displayName: "Dekho Dark", 
    description: "Dark, moody images", 
    gradient: "from-yellow-500 to-green-500" 
  },
  { 
    name: "flux-pro", 
    displayName: "Dekho Pro", 
    description: "Professional-level generation", 
    gradient: "from-purple-600 to-blue-600" 
  },
  { 
    name: "turbo", 
    displayName: "Dekho Turbo", 
    description: "Fast and high-quality generation", 
    gradient: "from-yellow-500 to-orange-500" 
  },
]

interface ChatHistory {
  prompt: string;
  response: string;
}

export default function ERAImage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000))
  const [enhancePrompt, setEnhancePrompt] = useState(false)
  const [noLogo, setNoLogo] = useState(false)
  const [chatHistories, setChatHistories] = useState<{[key: string]: ChatHistory[]}>({})

  useEffect(() => {
    const storedHistories = localStorage.getItem('chatHistories')
    if (storedHistories) {
      setChatHistories(JSON.parse(storedHistories))
    }
  }, [])

  useEffect(() => {
    if (selectedModel && chatHistories[selectedModel]) {
      const lastChat = chatHistories[selectedModel][chatHistories[selectedModel].length - 1]
      setPrompt(lastChat.prompt)
      setResponse(lastChat.response)
    } else {
      setPrompt('')
      setResponse('')
    }
  }, [selectedModel])

  const generateImage = async () => {
    setLoading(true)
    setResponse('')

    try {
      const baseUrl = 'https://image.pollinations.ai/prompt/'
      const encodedPrompt = encodeURIComponent(prompt)
      let url = `${baseUrl}${encodedPrompt}?model=${selectedModel}&seed=${seed}&width=${width}&height=${height}`
      if (enhancePrompt) url += '&enhance=1'
      if (noLogo) url += '&nologo=1'
      
      const response = await fetch(url)
      if (response.ok) {
        const imageUrl = response.url
        setResponse(imageUrl)
        updateChatHistory(prompt, imageUrl)
      } else {
        throw new Error('Failed to generate image')
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while generating the image.')
    } finally {
      setLoading(false)
    }
  }

  const updateChatHistory = (prompt: string, response: string) => {
    if (selectedModel) {
      const updatedHistories = { ...chatHistories }
      if (!updatedHistories[selectedModel]) {
        updatedHistories[selectedModel] = []
      }
      updatedHistories[selectedModel].push({ prompt, response })
      setChatHistories(updatedHistories)
      localStorage.setItem('chatHistories', JSON.stringify(updatedHistories))
    }
  }

  const downloadImage = async () => {
    if (!response) return
    try {
      const image = await fetch(response)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
      
      const link = document.createElement('a')
      link.href = imageURL
      link.download = 'generated-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  if (selectedModel) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <header className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => setSelectedModel(null)} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h2 className="text-xl font-semibold">{selectedModel}</h2>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[540px] bg-gray-900 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Image Settings</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="width">Width: {width}px</Label>
                    <Slider id="width" min={64} max={1024} step={64} value={[width]} onValueChange={(value) => setWidth(value[0])} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height: {height}px</Label>
                    <Slider id="height" min={64} max={1024} step={64} value={[height]} onValueChange={(value) => setHeight(value[0])} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seed">Seed: {seed}</Label>
                    <Slider id="seed" min={0} max={1000000} step={1} value={[seed]} onValueChange={(value) => setSeed(value[0])} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="enhance" checked={enhancePrompt} onCheckedChange={setEnhancePrompt} />
                    <Label htmlFor="enhance">Enhance Prompt</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="nologo" checked={noLogo} onCheckedChange={setNoLogo} />
                    <Label htmlFor="nologo">Remove Logo</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {response && (
            <div className="mb-4 p-4 bg-gray-900 rounded-lg">
              <div className="relative">
                <img src={response} alt="Generated" className="w-full h-auto max-h-[70vh] object-contain rounded-lg" />
                <Button 
                  onClick={downloadImage} 
                  className="absolute top-2 right-2 bg-white bg-opacity-50 hover:bg-opacity-70 text-black border border-black"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              </div>
          )}
        </main>
        <footer className="sticky bottom-0 border-t border-gray-800 bg-black p-4">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              placeholder="Enter your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-gray-900 border-gray-700 text-white"
            />
            <Button 
              onClick={generateImage}
              disabled={loading || !prompt}
              className="bg-[#4221ff] hover:bg-[#4221ff] text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
            </Button>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <ImageIcon className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">Dekho AI</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageModelDetails.map(({ name, displayName, description, gradient }) => (
            <Card
              key={name}
              className={`bg-gray-900 border-gray-800 hover:border-blue-600 cursor-pointer transition-all duration-300 transform hover:scale-105`}
              onClick={() => setSelectedModel(name)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{displayName}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
            }
