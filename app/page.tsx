'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Trash2, MoveUp, MoveDown } from 'lucide-react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: true })

type Scene = {
  id: number
  imagePrompt: string
  contentPrompt: string
  imageUrl?: string
  audioUrl?: string
}

export default function VideoGenerator() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [imagePrompt, setImagePrompt] = useState('')
  const [contentPrompt, setContentPrompt] = useState('')
  const [voice, setVoice] = useState('mrbeast')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    loadFFmpeg()
  }, [])

  const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load()
    }
  }

  const addScene = () => {
    if (imagePrompt && contentPrompt) {
      setScenes([...scenes, { id: Date.now(), imagePrompt, contentPrompt }])
      setImagePrompt('')
      setContentPrompt('')
    }
  }

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id))
  }

  const moveScene = (index: number, direction: 'up' | 'down') => {
    const newScenes = [...scenes]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < scenes.length) {
      [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]]
      setScenes(newScenes)
    }
  }

  const generateImage = async (prompt: string): Promise<string> => {
    setStatusMessage(`Generating image for prompt: ${prompt}`)
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?height=1080&width=1920`
    
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    return imageUrl
  }

  const generateAudio = async (text: string, voiceName: string): Promise<string> => {
    setStatusMessage(`Generating audio for text: ${text}`)
    const url = "https://audio.api.speechify.com/generateAudioFiles"
    const payload = {
      audioFormat: "mp3",
      paragraphChunks: [text],
      voiceParams: {
        name: voiceName,
        engine: "speechify",
        languageCode: "en-US"
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate audio: ${response.statusText}`)
      }

      const data = await response.json()
      if (!data.audioStream) {
        throw new Error('No audio data received')
      }

      return `data:audio/mp3;base64,${data.audioStream}`
    } catch (error) {
      console.error('Error in generateAudio:', error)
      throw error
    }
  }

  const createVideoClip = async (scene: Scene, index: number): Promise<void> => {
    setStatusMessage(`Creating video clip for scene: ${scene.imagePrompt}`)
    
    // Write image file
    ffmpeg.FS('writeFile', `image${index}.jpg`, await fetchFile(scene.imageUrl!))
    
    // Write audio file
    ffmpeg.FS('writeFile', `audio${index}.mp3`, await fetchFile(scene.audioUrl!))
    
    // Run FFmpeg command to create video with zooming effect
    await ffmpeg.run(
      '-loop', '1', 
      '-i', `image${index}.jpg`, 
      '-i', `audio${index}.mp3`, 
      '-filter_complex', '[0:v]scale=1920:1080,zoompan=z=\'min(zoom+0.0015,1.5)\':d=125,format=yuv420p[v]', 
      '-map', '[v]', 
      '-map', '1:a', 
      '-c:v', 'libx264', 
      '-c:a', 'aac', 
      '-shortest', 
      `output${index}.mp4`
    )
  }

  const generateVideo = async () => {
    setIsGenerating(true)
    setProgress(0)
    setStatusMessage('Starting video generation...')

    try {
      const totalSteps = scenes.length * 3 + 1 // Image + Audio + Video for each scene, plus final compilation
      let completedSteps = 0

      const updatedScenes = await Promise.all(scenes.map(async (scene) => {
        const imageUrl = await generateImage(scene.imagePrompt)
        completedSteps++
        setProgress((completedSteps / totalSteps) * 100)

        const audioUrl = await generateAudio(scene.contentPrompt, voice)
        completedSteps++
        setProgress((completedSteps / totalSteps) * 100)

        return { ...scene, imageUrl, audioUrl }
      }))

      setStatusMessage('Generating video clips...')
      await Promise.all(updatedScenes.map((scene, index) => {
        return createVideoClip(scene, index).then(() => {
          completedSteps++
          setProgress((completedSteps / totalSteps) * 100)
        })
      }))

      setStatusMessage('Combining video clips...')
      const inputFiles = updatedScenes.map((_, index) => `file output${index}.mp4`).join('\n')
      ffmpeg.FS('writeFile', 'input.txt', inputFiles)

      await ffmpeg.run(
        '-f', 'concat',
        '-safe', '0',
        '-i', 'input.txt',
        '-c', 'copy',
        'output.mp4'
      )

      const data = ffmpeg.FS('readFile', 'output.mp4')
      const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))

      if (videoRef.current) {
        videoRef.current.src = videoUrl
      }

      completedSteps++
      setProgress(100)
      setStatusMessage('Video generation complete!')
    } catch (error) {
      console.error('Error generating video:', error)
      setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Video Generator</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Scene</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Image prompt"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className="mb-3"
          />
          <Textarea
            placeholder="Content prompt"
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value)}
            className="mb-3"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={addScene} className="w-full">Add Scene</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4 mb-6">
        {scenes.map((scene, index) => (
          <Card key={scene.id}>
            <CardContent className="pt-6">
              <p className="mb-2"><strong>Image Prompt:</strong> {scene.imagePrompt}</p>
              <p className="mb-2"><strong>Content Prompt:</strong> {scene.contentPrompt}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => deleteScene(scene.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <div>
                <Button variant="outline" onClick={() => moveScene(index, 'up')} disabled={index === 0} className="mr-2">
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => moveScene(index, 'down')} disabled={index === scenes.length - 1}>
                  <MoveDown className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Voice Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {['jamie', 'mrbeast', 'snoop', 'henry', 'gwyneth', 'cliff', 'narrator'].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button onClick={generateVideo} disabled={scenes.length === 0 || isGenerating} className="w-full mb-6">
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </Button>

      {isGenerating && (
        <div className="mb-6">
          <Progress value={progress} className="mb-2" />
          <p className="text-center font-semibold animate-pulse">
            {statusMessage}
          </p>
        </div>
      )}

      <video ref={videoRef} controls className="w-full rounded-lg shadow-lg" />
    </div>
  )
    }
