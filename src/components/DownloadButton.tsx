'use client'

import { useState, useCallback } from 'react'
import { Year } from '@/types'

interface DownloadButtonProps {
  flagSrc: string
  year: Year
  era: string
}

type DownloadFormat = 'png' | 'svg'

export function DownloadButton({ flagSrc, year, era }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const getFileName = (format: DownloadFormat) => {
    const sanitizedEra = era.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    return `ontario-flag-${year}-${sanitizedEra}.${format}`
  }

  const downloadSVG = useCallback(async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(flagSrc)
      const svgText = await response.text()

      const blob = new Blob([svgText], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = getFileName('svg')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading SVG:', error)
    } finally {
      setIsDownloading(false)
      setShowOptions(false)
    }
  }, [flagSrc, year, era])

  const downloadPNG = useCallback(async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(flagSrc)
      const svgText = await response.text()

      // Parse the SVG to get dimensions
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
      const svgElement = svgDoc.documentElement

      // Get viewBox or width/height
      const viewBox = svgElement.getAttribute('viewBox')
      let width = 1200  // Default high-res width
      let height = 600  // Default height (2:1 ratio for flags)

      if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
        if (vbWidth && vbHeight) {
          // Scale up to high resolution while maintaining aspect ratio
          const aspectRatio = vbHeight / vbWidth
          width = 1200
          height = Math.round(width * aspectRatio)
        }
      }

      // Create a data URL from the SVG
      const svgBase64 = btoa(unescape(encodeURIComponent(svgText)))
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`

      // Create image and load SVG
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Draw white background (for transparency)
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)

          // Draw the image scaled to canvas size
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to PNG and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = getFileName('png')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
            setIsDownloading(false)
            setShowOptions(false)
          }, 'image/png', 1.0)
        } else {
          setIsDownloading(false)
          setShowOptions(false)
        }
      }

      img.onerror = () => {
        console.error('Error loading SVG for PNG conversion')
        setIsDownloading(false)
        setShowOptions(false)
      }

      img.src = dataUrl
    } catch (error) {
      console.error('Error downloading PNG:', error)
      setIsDownloading(false)
      setShowOptions(false)
    }
  }, [flagSrc, year, era])

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isDownloading}
        className="
          flex items-center gap-2
          px-4 py-2
          bg-gradient-to-b from-[#2a2520] to-[#1a1510]
          border border-[#3a3530]
          text-[11px] tracking-[0.1em] text-[#c9a86c]
          font-mono uppercase
          hover:border-[#4a4540] hover:text-[#d9b87c]
          active:bg-[#151210]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all
        "
      >
        {/* Download icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>

      {/* Dropdown options */}
      {showOptions && !isDownloading && (
        <div className="
          absolute bottom-full right-0 mb-1 z-50
          bg-gradient-to-b from-[#2a2520] to-[#1a1510]
          border border-[#3a3530]
          shadow-lg
          min-w-[100px]
        ">
          <button
            onClick={downloadPNG}
            className="
              w-full px-4 py-2.5
              text-left text-[11px] tracking-[0.1em] text-[#b5a5a0]
              font-mono uppercase
              hover:bg-[#3a3530] hover:text-[#c9a86c]
              border-b border-[#3a3530]
              transition-colors
            "
          >
            PNG
          </button>
          <button
            onClick={downloadSVG}
            className="
              w-full px-4 py-2.5
              text-left text-[11px] tracking-[0.1em] text-[#b5a5a0]
              font-mono uppercase
              hover:bg-[#3a3530] hover:text-[#c9a86c]
              transition-colors
            "
          >
            SVG
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  )
}
