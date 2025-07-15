import { useState } from 'react'
import { generateViralTitle } from '../utils/titleGenerator'

function ClipCard({ clip }) {
  const [showTitleGenerator, setShowTitleGenerator] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatTimeAgo = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  const copyClipLink = () => {
    navigator.clipboard.writeText(clip.url)
    console.log('Clip link copied to clipboard!')
  }

  const downloadClip = () => {
    console.log('Downloading clip:', clip.title)
  }

  const generateTitles = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const titles = []
      for (let i = 0; i < 3; i++) {
        titles.push(generateViralTitle(clip.title, clip.broadcaster_name))
      }
      setGeneratedTitles(titles)
      setIsGenerating(false)
    }, 1000)
  }

  const openInNewTab = () => {
    window.open(clip.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="clip-card">
      {/* Clip Preview */}
      <div className="clip-preview">
        {showPreview ? (
          <>
            <iframe
              src={clip.embed_url + '&parent=' + window.location.hostname}
              title={clip.title}
              allowFullScreen
              className="clip-iframe"
            />
            <button
              className="clip-preview-close"
              onClick={() => setShowPreview(false)}
              aria-label="Close preview"
            >
              ×
            </button>
          </>
        ) : (
          <div className="clip-preview-img-wrap">
            <img 
              src={clip.thumbnail_url} 
              alt={clip.title}
              className="clip-preview-img"
              draggable="false"
            />
            {/* Play Button Overlay - always visible, centered, and only the button is clickable */}
            <button
              className="clip-play-btn"
              onClick={() => setShowPreview(true)}
              aria-label="Play preview"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.7"/>
                <polygon points="16,13 28,20 16,27" fill="#7c3aed"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Clip Info */}
      <div className="clip-info">
        <h3 className="clip-title">{clip.title}</h3>
        <span className="clip-badge"><span className="clip-badge-icon">🔥</span>{clip.virality_score}</span>
      </div>
      <div className="clip-meta">
        <span>{clip.broadcaster_name}</span>
        <span>•</span>
        <span>{formatTimeAgo(clip.created_at)}</span>
      </div>
      {/* Tags */}
      <div className="clip-tags">
        {clip.tags.map((tag, index) => (
          <span key={index} className="clip-tag">{tag}</span>
        ))}
      </div>
      {/* Actions */}
      <div className="clip-actions">
        <button onClick={openInNewTab} className="clip-btn">🔗 Open in New Tab</button>
      </div>
    </div>
  )
}

export default ClipCard 