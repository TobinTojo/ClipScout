import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

function ClipList({ userId, folderId }) {
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClips() {
      setLoading(true)
      let query = supabase
        .from('clips')
        .select('*')
        .eq('user_id', userId)
      if (folderId) {
        query = query.eq('folder_id', folderId)
      }
      query = query.order('created_at', { ascending: false })
      const { data, error } = await query
      if (!error) setClips(data)
      setLoading(false)
    }
    if (userId) fetchClips()
  }, [userId, folderId])

  if (loading) return <div className="clip-loading">Loading clips...</div>
  if (!clips.length) return <div className="clip-empty">No clips found in this folder.</div>

  return (
    <ul className="clip-list">
      {clips.map(clip => (
        <li key={clip.id} className="clip-card">
          <div className="clip-title">{clip.title}</div>
          <a href={clip.url} target="_blank" rel="noopener noreferrer" className="clip-url">{clip.url}</a>
          <div className="clip-tags">
            {clip.tags && clip.tags.map((tag, i) => (
              <span key={i} className="clip-tag">{tag.startsWith('#') ? tag : `#${tag}`}</span>
            ))}
          </div>
          <div className="clip-meta">
            {clip.planned_edit && <span className="clip-plan-edit">📝 Planned Edit</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ClipList 