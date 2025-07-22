import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

function Header({ session, activeTab, setActiveTab }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }
  return (
    <header className="header spotify-header">
      <div className="header-container spotify-header-container">
        <div className="spotify-header-row">
          {/* Purple logo with CS */}
          <div className="spotify-logo-circle purple-logo-circle">
            <span className="cs-logo-text">CS</span>
          </div>
          <span className="spotify-header-title">ClipScout</span>
          {/* Hamburger for mobile */}
          <button className="spotify-hamburger" onClick={() => setMobileNavOpen(v => !v)} aria-label="Open navigation">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="6" width="28" height="2.5" rx="1.25" fill="#fff"/>
              <rect y="13" width="28" height="2.5" rx="1.25" fill="#fff"/>
              <rect y="20" width="28" height="2.5" rx="1.25" fill="#fff"/>
            </svg>
          </button>
          {/* Desktop nav */}
          <nav className="spotify-nav-desktop">
            <button
              onClick={() => setActiveTab('trending')}
              className={`spotify-nav-btn${activeTab === 'trending' ? ' active' : ''}`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`spotify-nav-btn${activeTab === 'search' ? ' active' : ''}`}
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`spotify-nav-btn${activeTab === 'library' ? ' active' : ''}`}
            >
              Library
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`spotify-nav-btn${activeTab === 'creators' ? ' active' : ''}`}
            >
              Creators
            </button>
          </nav>
          {/* User actions */}
          <div className="spotify-header-user-actions">
            {session?.user?.email && (
              <span className="spotify-header-username">{session.user.email}</span>
            )}
            <button className="spotify-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        {/* Mobile nav overlay */}
        {mobileNavOpen && (
          <nav className="spotify-nav-mobile">
            <button
              onClick={() => { setActiveTab('trending'); setMobileNavOpen(false) }}
              className={`spotify-nav-btn${activeTab === 'trending' ? ' active' : ''}`}
            >
              Trending
            </button>
            <button
              onClick={() => { setActiveTab('search'); setMobileNavOpen(false) }}
              className={`spotify-nav-btn${activeTab === 'search' ? ' active' : ''}`}
            >
              Search
            </button>
            <button
              onClick={() => { setActiveTab('library'); setMobileNavOpen(false) }}
              className={`spotify-nav-btn${activeTab === 'library' ? ' active' : ''}`}
            >
              Library
            </button>
            <button
              onClick={() => { setActiveTab('creators'); setMobileNavOpen(false) }}
              className={`spotify-nav-btn${activeTab === 'creators' ? ' active' : ''}`}
            >
              Creators
            </button>
            <button className="spotify-logout-btn" onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header 