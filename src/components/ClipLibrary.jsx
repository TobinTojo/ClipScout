import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import FolderList from './FolderList'
import ClipList from './ClipList'
import './ClipLibrary.css'

function ClipLibrary() {
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
    })
  }, [])

  if (!userId) return <div>Loading your library...</div>

  return (
    <div className="clip-library-main">
      {/* Folder List Sidebar */}
      <aside className="clip-library-sidebar">
        <div className="clip-library-card">
          <h3 className="clip-library-title">📁 Folders</h3>
          <FolderList userId={userId} selectedFolder={selectedFolder} onSelectFolder={setSelectedFolder} />
        </div>
      </aside>
      {/* Clip List Main */}
      <section className="clip-library-content">
        <div className="clip-library-card">
          <h3 className="clip-library-title">🎬 Clips</h3>
          <ClipList userId={userId} folderId={selectedFolder} />
        </div>
      </section>
    </div>
  )
}

export default ClipLibrary 