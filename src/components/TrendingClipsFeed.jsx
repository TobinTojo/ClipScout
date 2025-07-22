import { useState, useEffect } from 'react'
import { fetchTrendingClips } from '../utils/twitchApi'
import ClipCard from './ClipCard'
import { supabase } from '../utils/supabaseClient'

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
  const [category, setCategory] = useState(() => {
    return localStorage.getItem('lastCategory') || 'Just Chatting'
  })
  const [categoryInput, setCategoryInput] = useState(() => {
    return localStorage.getItem('lastCategory') || 'Just Chatting'
  })
  const [categorySuggestions, setCategorySuggestions] = useState([])
  const [language, setLanguage] = useState('')

  useEffect(() => {
    loadTrendingClips()
    // eslint-disable-next-line
  }, [category, language])

  useEffect(() => {
    localStorage.setItem('lastCategory', category)
  }, [category])

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
    localStorage.setItem('lastCategory', cat)
  }

  // Strict language filtering
  const filteredClips = language
    ? clips.filter(clip => clip.language === language)
    : clips

  // Restore Save button
  const handleSaveClip = (clip) => {
    // Optionally show a notification or refresh
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
      </div>
      {loading && (
        <div className="card-pro text-center text-[#a1a1aa]">Loading trending clips...</div>
      )}
      {error && !loading && (
        <div className="card-pro text-center text-[#a1a1aa]">{error}</div>
      )}
      {!loading && !error && filteredClips.length > 0 && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2" style={{color:'#a78bfa'}}>📺 Trending in {category}</h3>
            <div className="text-[#a1a1aa] mb-4">Found {filteredClips.length} clip{filteredClips.length !== 1 ? 's' : ''}</div>
          </div>
          <div>
            {filteredClips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} onSave={handleSaveClip} />
            ))}
          </div>
        </div>
      )}
      {!loading && !error && filteredClips.length === 0 && (
        <div className="card-pro text-center text-[#a1a1aa]">
          <div className="mb-4 text-5xl">😕</div>
          <div className="mb-2 font-bold text-lg">No clips found for this filter</div>
          <div className="mb-4">Try a different category or language.</div>
        </div>
      )}
    </div>
  )
}

export default TrendingClipsFeed 