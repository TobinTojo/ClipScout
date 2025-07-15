import { useState } from 'react'
import TrendingClipsFeed from './components/TrendingClipsFeed'
import StreamerSearch from './components/StreamerSearch'
import Header from './components/Header'

function App() {
  const [activeTab, setActiveTab] = useState('trending')

  return (
    <div className="app-root">
      <Header />
      <main className="main-container">
        {/* Tab Navigation */}
        <div className="tab-row">
          <button
            onClick={() => setActiveTab('trending')}
            className={`tab-btn${activeTab === 'trending' ? ' tab-btn-active' : ''}`}
          >
            🔥 Trending Clips
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`tab-btn${activeTab === 'search' ? ' tab-btn-active' : ''}`}
          >
            🔍 Streamer Search
          </button>
        </div>
        <div>
          {activeTab === 'trending' && <TrendingClipsFeed />}
          {activeTab === 'search' && <StreamerSearch />}
        </div>
      </main>
    </div>
  )
}

export default App
