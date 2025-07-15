import { useState, useEffect } from 'react'
import { fetchTrendingClips } from '../utils/twitchApi'
import ClipCard from './ClipCard'

const POPULAR_CATEGORIES = [
  'Just Chatting',
  'Valorant',
  'Fortnite',
  'League of Legends',
  'Grand Theft Auto V',
  'Minecraft',
  'Counter-Strike',
  'Apex Legends',
  'Call of Duty',
]
const LANGUAGE_OPTIONS = [
  { code: '', label: 'All Languages' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ru', label: 'Russian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
]

function TrendingClipsFeed() {
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('Just Chatting')
  const [categoryInput, setCategoryInput] = useState('Just Chatting')
  const [categorySuggestions, setCategorySuggestions] = useState([])
  const [language, setLanguage] = useState('')

  useEffect(() => {
    loadTrendingClips()
    // eslint-disable-next-line
  }, [category, language])

  const loadTrendingClips = async () => {
    try {
      setLoading(true)
      setError(null)
      // fetchTrendingClips now takes category and language
      const trendingClips = await fetchTrendingClips(category, language)
      setClips(trendingClips)
    } catch (err) {
      setError('Failed to load trending clips. Please try again.')
      console.error('Error loading trending clips:', err)
    } finally {
      setLoading(false)
    }
  }

  // Autocomplete logic for category
  useEffect(() => {
    if (!categoryInput) {
      setCategorySuggestions([])
      return
    }
    const inputLower = categoryInput.toLowerCase()
    const suggestions = POPULAR_CATEGORIES.filter(cat => cat.toLowerCase().includes(inputLower))
    setCategorySuggestions(suggestions)
  }, [categoryInput])

  const handleCategorySelect = (cat) => {
    setCategory(cat)
    setCategoryInput(cat)
    setCategorySuggestions([])
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{color:'#a78bfa'}}>🔥 Trending Clips (Last 24h)</h2>
        <div className="text-[#a1a1aa] mb-6">Discover the most viral moments from Twitch streams</div>
        {/* Category and Language Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <input
              type="text"
              className="filter-input"
              value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}
              placeholder="Search category..."
              autoComplete="off"
            />
            {categorySuggestions.length > 0 && (
              <div className="filter-dropdown">
                {categorySuggestions.map((cat, idx) => (
                  <div
                    key={cat}
                    className="filter-dropdown-item"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-group">
            <label className="filter-label">Language</label>
            <select
              className="filter-input"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGE_OPTIONS.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="sort-controls">
          <div className="sort-buttons">
            <button onClick={() => setClips([...clips].sort((a, b) => b.virality_score - a.virality_score))} className="btn-pro-secondary">🔥 Sort by Virality</button>
            <button onClick={() => setClips([...clips].sort((a, b) => b.view_count - a.view_count))} className="btn-pro-secondary">👀 Sort by Views</button>
            <button onClick={() => setClips([...clips].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))} className="btn-pro-secondary">⏰ Sort by Recent</button>
          </div>
          <button onClick={loadTrendingClips} className="btn-pro">🔄 Refresh</button>
        </div>
      </div>
      {loading ? (
        <div className="card-pro text-center text-[#a1a1aa]">Loading trending clips...</div>
      ) : error ? (
        <div className="card-pro text-center text-[#a1a1aa]">{error}</div>
      ) : clips.length === 0 ? (
        <div className="card-pro text-center text-[#a1a1aa]">No trending clips found</div>
      ) : (
        <div>
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
      <div className="card-pro mt-8">
        <h3 className="text-lg font-bold mb-3" style={{color:'#a78bfa'}}>📊 Feed Stats</h3>
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-[#a1a1aa] text-sm mb-1">Total Clips</div>
            <div className="text-xl font-bold">{clips.length}</div>
          </div>
          <div>
            <div className="text-[#a1a1aa] text-sm mb-1">Avg Views</div>
            <div className="text-xl font-bold">{clips.length > 0 ? Math.round(clips.reduce((sum, clip) => sum + clip.view_count, 0) / clips.length).toLocaleString() : 0}</div>
          </div>
          <div>
            <div className="text-[#a1a1aa] text-sm mb-1">Avg Virality Score</div>
            <div className="text-xl font-bold">{clips.length > 0 ? Math.round(clips.reduce((sum, clip) => sum + clip.virality_score, 0) / clips.length) : 0}</div>
          </div>
          <div>
            <div className="text-[#a1a1aa] text-sm mb-1">Top Streamer</div>
            <div className="text-lg font-semibold">{clips.length > 0 ? clips.reduce((top, clip) => clip.view_count > top.view_count ? clip : top).broadcaster_name : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingClipsFeed 