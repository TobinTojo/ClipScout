import { useState, useEffect } from 'react'
import { generateViralTitle } from '../utils/titleGenerator'
import { supabase } from '../utils/supabaseClient'
import { generateTagsWithGroq } from '../utils/groqTagGenerator';

function ClipCard({ clip, onSave }) {
  const [showTitleGenerator, setShowTitleGenerator] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSaveForm, setShowSaveForm] = useState(false)

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
      <div className="flex gap-2 mt-4">
        <button className="btn-pro-secondary" onClick={copyClipLink}>🔗 Copy Link</button>
        {onSave && (
          <button className="btn-pro" onClick={() => setShowSaveForm(!showSaveForm)}>{showSaveForm ? 'Cancel' : '💾 Save'}</button>
        )}
      </div>
      {showSaveForm && (
        <div className="mt-4">
          <SaveClipForm clip={clip} onClose={() => setShowSaveForm(false)} onSave={onSave} />
        </div>
      )}
    </div>
  )
}

function SaveClipForm({ clip, onClose, onSave }) {
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [generatingTags, setGeneratingTags] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
    })
  }, [])

  useEffect(() => {
    async function fetchFolders() {
      if (!userId) return
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      if (!error) setFolders(data)
    }
    fetchFolders()
  }, [userId])

  // AI Tag Generation (Groq)
  useEffect(() => {
    async function generateTags() {
      setGeneratingTags(true);
      setError(null);
      try {
        const prompt = `Generate 5 short, relevant, comma-separated tags for this Twitch clip.\nTitle: ${clip.title}\nBroadcaster: ${clip.broadcaster_name}\nRespond with only the tags, separated by commas.`;
        const tagString = await generateTagsWithGroq(prompt);
        const aiTags = tagString.split(',').map(t => t.trim()).filter(Boolean);
        setTags(aiTags);
      } catch (err) {
        setError('Groq tag generation failed: ' + err.message);
      } finally {
        setGeneratingTags(false);
      }
    }
    generateTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip]);

  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    setCreatingFolder(true)
    setError(null)
    const { error } = await supabase.from('folders').insert({
      user_id: userId,
      name: newFolderName.trim(),
    })
    setCreatingFolder(false)
    setNewFolderName('')
    if (error) {
      setError('Failed to create folder')
    } else {
      setFolders([...folders, { id: error.code, name: newFolderName.trim() }])
      setSelectedFolder(error.code)
      setShowCreateFolder(false)
    }
  }

  const handleSave = async () => {
    if (!selectedFolder) {
      setError('Please select a folder')
      return
    }
    setSaving(true)
    setError(null)
    const { error } = await supabase.from('clips').insert({
      user_id: userId,
      folder_id: selectedFolder,
      url: clip.url,
      title: clip.title,
      tags,
      downloaded: false,
      planned_edit: false,
    })
    setSaving(false)
    if (error) {
      setError('Failed to save clip')
    } else {
      if (onSave) onSave(clip)
      onClose()
    }
  }

  // When showing the create folder input, prefill with broadcaster_name
  const handleShowCreateFolder = () => {
    setShowCreateFolder(true)
    setNewFolderName(clip.broadcaster_name || '')
  }

  return (
    <div className="save-clip-form">
      <h3 className="save-clip-title">Save Clip</h3>
      <div className="save-clip-section">
        <label className="save-clip-label">Select Folder</label>
        <div className="save-clip-folder-row">
          <select
            className="input-pro"
            value={selectedFolder}
            onChange={e => setSelectedFolder(e.target.value)}
            disabled={saving || creatingFolder}
          >
            <option value="">-- Select a folder --</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
          <button
            className="btn-pro-secondary"
            type="button"
            onClick={handleShowCreateFolder}
            disabled={saving || creatingFolder}
          >
            + New
          </button>
        </div>
        {showCreateFolder && (
          <div className="save-clip-create-folder-row">
            <input
              type="text"
              className="input-pro"
              placeholder="Folder name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              disabled={creatingFolder}
            />
            <button
              className="btn-pro"
              type="button"
              onClick={handleCreateFolder}
              disabled={creatingFolder || !newFolderName.trim()}
            >
              {creatingFolder ? 'Creating...' : 'Create'}
            </button>
            <button
              className="btn-pro-secondary"
              type="button"
              onClick={() => setShowCreateFolder(false)}
              disabled={creatingFolder}
            >
              Cancel
            </button>
          </div>
        )}
        <label className="save-clip-label">Tags</label>
        {generatingTags && <div className="save-clip-tags-list">Generating tags...</div>}
        {error && <div className="save-clip-error">{error}</div>}
        <form onSubmit={handleAddTag} className="save-clip-tag-row">
          <input
            type="text"
            className="input-pro"
            placeholder="Add tag"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            disabled={saving}
          />
          <button className="btn-pro" type="submit" disabled={saving || !tagInput.trim()}>Add</button>
        </form>
        <div className="save-clip-tags-list">
          {tags.map(tag => (
            <span key={tag} className="badge-pro" onClick={() => handleRemoveTag(tag)}>{tag} ✕</span>
          ))}
        </div>
      </div>
      {error && <div className="save-clip-error">{error}</div>}
      <div className="save-clip-actions">
        <button className="btn-pro-secondary" onClick={onClose} disabled={saving}>Cancel</button>
        <button className="btn-pro" onClick={handleSave} disabled={saving || !selectedFolder}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default ClipCard 