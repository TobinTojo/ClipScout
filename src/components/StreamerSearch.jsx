import { useState } from 'react'
import { fetchStreamerClips } from '../utils/twitchApi'
import ClipCard from './ClipCard'
import { supabase } from '../utils/supabaseClient'

function StreamerSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)
      const streamerClips = await fetchStreamerClips(searchTerm.trim())
      setClips(streamerClips)
      if (streamerClips.length === 0) {
        setError(`No clips found for streamer "${searchTerm}"`)
      }
    } catch (err) {
      setError('Failed to search for clips. Please try again.')
      console.error('Error searching clips:', err)
    } finally {
      setLoading(false)
    }
  }
  const clearSearch = () => {
    setSearchTerm('')
    setClips([])
    setError(null)
    setHasSearched(false)
  }
  const sortByVirality = () => {
    setClips([...clips].sort((a, b) => b.virality_score - a.virality_score))
  }
  const sortByViews = () => {
    setClips([...clips].sort((a, b) => b.view_count - a.view_count))
  }
  const sortByRecent = () => {
    setClips([...clips].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
  }
  const handleSaveClip = (clip) => {
    // This will be handled in the modal
  }
  return (
    <div className="streamer-search-wrap">
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-2" style={{color:'#a78bfa'}}>🔍 Search Streamer Clips</h2>
        <div className="text-[#a1a1aa] mb-6">Find the most viral clips from your favorite Twitch streamers</div>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter streamer username (e.g., xQc, Pokimane, Ninja)"
            className="input-pro flex-1"
          />
          <button type="submit" disabled={loading || !searchTerm.trim()} className="btn-pro">{loading ? '🔍 Searching...' : '🔍 Search'}</button>
          {hasSearched && (
            <button type="button" onClick={clearSearch} className="btn-pro-secondary">🗑️ Clear</button>
          )}
        </form>
      </div>
      {loading && (
        <div className="card-pro text-center text-[#a1a1aa]">Searching for clips...</div>
      )}
      {error && !loading && (
        <div className="card-pro text-center text-[#a1a1aa]">{error}</div>
      )}
      {!loading && !error && clips.length > 0 && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2" style={{color:'#a78bfa'}}>📺 Clips from {searchTerm}</h3>
            <div className="text-[#a1a1aa] mb-4">Found {clips.length} clip{clips.length !== 1 ? 's' : ''}</div>
            <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
              <div className="flex flex-wrap gap-3">
                <button onClick={sortByVirality} className="btn-pro-secondary">🔥 Sort by Virality</button>
                <button onClick={sortByViews} className="btn-pro-secondary">👀 Sort by Views</button>
                <button onClick={sortByRecent} className="btn-pro-secondary">⏰ Sort by Recent</button>
              </div>
            </div>
          </div>
          <div>
            {clips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} onSave={handleSaveClip} />
            ))}
          </div>
          <div className="card-pro mt-8 stats-card">
            <div className="stats-header">
              <span className="stats-icon">📊</span>
              <span className="stats-title">{searchTerm} Stats</span>
            </div>
            <div className="stats-grid">
              <div>
                <div className="stats-label">Total Clips</div>
                <div className="stats-value">{clips.length}</div>
              </div>
              <div>
                <div className="stats-label">Total Views</div>
                <div className="stats-value">{clips.reduce((sum, clip) => sum + clip.view_count, 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="stats-label">Avg Virality Score</div>
                <div className="stats-value">{Math.round(clips.reduce((sum, clip) => sum + clip.virality_score, 0) / clips.length)}</div>
              </div>
              <div>
                <div className="stats-label">Most Viral Clip</div>
                <div className="stats-value stats-clip-title" title={clips.reduce((top, clip) => clip.virality_score > top.virality_score ? clip : top).title}>
                  {clips.reduce((top, clip) => clip.virality_score > top.virality_score ? clip : top).title.substring(0, 20)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && !error && !hasSearched && (
        <div className="card-pro text-center text-[#a1a1aa]">
          <div className="mb-4 text-5xl">🔍</div>
          <div className="mb-2 font-bold text-lg">Search for a Streamer</div>
          <div className="mb-4">Enter a Twitch streamer's username to discover their most viral clips</div>
          <div>
            <div className="mb-2 text-sm">Popular streamers to try:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['xQc', 'Pokimane', 'Ninja', 'Shroud', 'Ludwig'].map((streamer) => (
                <button key={streamer} onClick={() => setSearchTerm(streamer)} className="btn-pro-secondary text-sm">{streamer}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamerSearch 