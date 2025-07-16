import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

function FolderList({ userId, selectedFolder, onSelectFolder }) {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [newFolder, setNewFolder] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  async function fetchFolders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (!error) setFolders(data)
    setLoading(false)
  }

  useEffect(() => {
    if (userId) fetchFolders()
    // eslint-disable-next-line
  }, [userId])

  const handleCreateFolder = async (e) => {
    e.preventDefault()
    if (!newFolder.trim()) return
    setCreating(true)
    setError(null)
    const { error } = await supabase.from('folders').insert({
      user_id: userId,
      name: newFolder.trim(),
    })
    if (error) setError('Failed to create folder')
    setNewFolder('')
    setCreating(false)
    fetchFolders()
  }

  return (
    <div className="folder-list">
      <form onSubmit={handleCreateFolder} className="folder-form" style={{marginBottom: '1.5rem', gap: '0.5rem'}}>
        <input
          type="text"
          className="folder-input"
          placeholder="New folder name"
          value={newFolder}
          onChange={e => setNewFolder(e.target.value)}
          disabled={creating}
          style={{flex: 1, minWidth: 0}}
        />
        <button className="add-folder-btn" type="submit" disabled={creating || !newFolder.trim()} style={{whiteSpace: 'nowrap', minWidth: '60px'}}>
          {creating ? '...' : 'Add'}
        </button>
      </form>
      {error && <div className="folder-error">{error}</div>}
      {loading ? (
        <div className="folder-loading">Loading folders...</div>
      ) : !folders.length ? (
        <div className="folder-empty">No folders found.</div>
      ) : (
        <ul className="folder-items">
          {folders.map(folder => (
            <li key={folder.id}>
              <button
                className={`folder-item${selectedFolder === folder.id ? ' selected' : ''}`}
                onClick={() => onSelectFolder(folder.id)}
              >
                <span className="folder-icon">📁</span>{folder.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FolderList 