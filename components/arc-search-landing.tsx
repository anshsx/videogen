"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Minus, Youtube, Twitter } from 'lucide-react'
import Image from 'next/image'

const features = [
  { 
    title: "INSTANT ANSWERS",
    description: "Generate the perfect answer to any question with Browse for Me.",
    image: "/placeholder.svg?height=400&width=200"
  },
  { 
    title: "VOICE SEARCH",
    description: "Search with your voice for lengthy questions on the go.",
    image: "/placeholder.svg?height=400&width=200"
  },
  { 
    title: "PINCH TO SUMMARIZE",
    description: "Get the gist in a pinch — literally.",
    image: "/placeholder.svg?height=400&width=200"
  },
]

const faqs = [
  {
    question: "How do I install Era Search?",
    answer: "Desktop: Scan the QR code with your iPhone, or download Era Search from the App Store. Mobile: Download Era Search directly from the App Store or visit the App Store on your iPhone to search for \"Era Search.\""
  },
  {
    question: "What devices are supported?",
    answer: "Currently, Era Search is available for iOS devices. We're working on support for other platforms."
  },
  {
    question: "How do I set Era Search as my default mobile browser?",
    answer: "Go to your iPhone's Settings > Era Search > Default Browser App, and select Era Search."
  },
  {
    question: "How do I sync across mobile and desktop?",
    answer: "Sign in with your Era account on both devices. Your data will automatically sync across platforms."
  },
  {
    question: "How do I share feedback?",
    answer: "You can share feedback through the app's settings menu or by visiting our website's feedback page."
  },
]

export function ArcSearchLanding() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const featureRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleScroll = () => {
    const scrollPosition = window.scrollY
    setIsScrolled(scrollPosition > 50)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleFeatureScroll = () => {
      if (featureRef.current) {
        const scrollContainer = featureRef.current
        const scrollLeft = scrollContainer.scrollLeft
        const containerWidth = scrollContainer.offsetWidth
        const featureWidth = containerWidth / features.length
        const newIndex = Math.round(scrollLeft / featureWidth)
        setCurrentFeature(newIndex)
      }
    }

    const featureContainer = featureRef.current
    if (featureContainer) {
      featureContainer.addEventListener('scroll', handleFeatureScroll)
      return () => featureContainer.removeEventListener('scroll', handleFeatureScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-gray-900">
      <div ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-b from-white via-white to-transparent h-24' : ''}`}>
        <div className={`container mx-auto px-4 py-6 flex justify-between items-center ${isScrolled ? 'bg-white' : ''} relative z-10`}>
          <div className="text-2xl font-bold">Era Search</div>
          <button className="px-6 py-2 rounded-full font-semibold transition-colors bg-white text-gray-900 hover:bg-gray-100">
            Download
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center text-center pt-20">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate={{
              backgroundImage: [
                'linear-gradient(45deg, #07C9E5, #0E7DF0)',
                'linear-gradient(45deg, #9499ED, #A164D9)',
                'linear-gradient(45deg, #FE6FFF, #FF3C8B)',
                'linear-gradient(45deg, #DE7F9D, #F0532A)',
                'linear-gradient(45deg, #DE7F9D, #F0532A)',
              ],
              transition: {
                duration: 10,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}
          >
            "Browse Boldly<br />Troll Wisely"<br />~ Era Search
          </motion.span>
        </motion.h1>
        <motion.button 
          className="px-8 py-4 rounded-full text-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Download Now →
        </motion.button>
        <motion.div 
          className="mt-20 cursor-pointer relative z-10 group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          onClick={scrollToContent}
        >
          <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Start Exploring</span>
          <ChevronDown className="mx-auto mt-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="mb-20 text-center">
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Era Search Logo"
            width={100}
            height={100}
            className="mx-auto mb-6"
          />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Era Search
            </span>
          </h2>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            is a mobile browser <span className="italic">for the you</span>
          </p>
        </div>

        <div className="bg-pink-50 p-8 sm:p-10 rounded-3xl max-w-4xl mx-auto mb-20 border border-pink-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            {features[currentFeature].description}
          </h2>
          
          <div 
            ref={featureRef}
            className="overflow-x-auto scrollbar-hide whitespace-nowrap scroll-smooth mb-8"
          >
            {features.map((feature, index) => (
              <button
                key={index}
                className={`inline-block text-center px-4 py-2 mx-2 rounded-full text-sm font-medium transition-colors ${
                  currentFeature === index
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 max-w-xs mx-auto mt-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
              <div>{currentTime}</div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="relative">
              <Image
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
                width={400}
                height={800}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg sm:text-xl font-semibold text-gray-800">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="text-gray-600 w-6 h-6 flex-shrink-0" />
                  ) : (
                    <Plus className="text-gray-600 w-6 h-6 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-8 sm:p-10 rounded-3xl">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-800">Scan this QR code with your phone</h2>
            <p className="text-lg sm:text-xl mb-10 text-gray-600">to download Era Search on the App Store.</p>
            <div className="inline-block">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="QR Code"
                width={200}
                height={200}
              />
            </div>
            <p className="mt-10 text-xl font-semibold text-gray-800">WE'RE WORKING ON ANDROID, TOO!</p>
            <a href="#" className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors font-medium">TRY THE ANDROID BETA →</a>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">PRODUCT</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Download</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Arc Max</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Arc for iPhone</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Arc Boosts</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Integrations</a></li>
                <li><a href="#"   className="hover:text-gray-300 transition-colors">Credits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">RESOURCES</h3>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Resource Center</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Release Notes</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Students</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Careers @ BCNY</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#" className="hover:text-gray-300 transition-colors">
                <Youtube size={28} />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <Twitter size={28} />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              THE BROWSER COMPANY of NEW YORK
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}