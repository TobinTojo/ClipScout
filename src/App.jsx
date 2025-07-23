import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './utils/supabaseClient'
import TrendingClipsFeed from './components/TrendingClipsFeed'
import StreamerSearch from './components/StreamerSearch'
import Header from './components/Header'
import ClipLibrary from './components/ClipLibrary'
import TrendingCreators from './components/TrendingCreators'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { fetchTrendingClips } from './utils/twitchApi'

function AuthModal({ view }) {
  const navigate = useNavigate();
  useEffect(() => {
    function handleClick(e) {
      if (e.target.matches('a[href="#auth-sign-in"]')) {
        e.preventDefault();
        navigate('/signin');
      } else if (e.target.matches('a[href="#auth-sign-up"]')) {
        e.preventDefault();
        navigate('/signup');
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b]">
      <div className="card-pro-signup">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#a78bfa' }}>
          {view === 'sign_up' ? 'Sign up for ClipScout' : 'Sign in to ClipScout'}
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          view={view}
          key={view}
        />
      </div>
    </div>
  )
}

function Landing({ onSignUp, onLogIn }) {
  const [justChattingClip, setJustChattingClip] = useState(null);
  const [loadingClip, setLoadingClip] = useState(true);
  const [playingClip, setPlayingClip] = useState(false);

  useEffect(() => {
    async function loadClip() {
      setLoadingClip(true);
      try {
        const clips = await fetchTrendingClips('Just Chatting', 'en');
        let filtered = clips.filter(
          c => /^[A-Za-z0-9 _-]+$/.test(c.broadcaster_name)
        );
        if (filtered.length > 0) {
          setJustChattingClip(filtered[0]);
        } else if (clips && clips.length > 0) {
          setJustChattingClip(clips[0]);
        }
      } catch (err) {
        setJustChattingClip(null);
      } finally {
        setLoadingClip(false);
      }
    }
    loadClip();
  }, []);

  return (
    <div className="landing-root">
      <Header session={null} onSignUp={onSignUp} onLogIn={onLogIn} />
      <main className="landing-main">
        {/* Hero Section - More modern with gradient background */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">Discover the Hottest <span className="gradient-text">Twitch Clips</span></h1>
            <p className="hero-subtitle">ClipScout helps you find, organize, and save the most viral Twitch moments—faster and smarter than ever before.</p>
            <div className="hero-cta">
              <button className="primary-btn" onClick={onSignUp}>
                Get Started
              </button>
              <button className="secondary-btn" onClick={onLogIn}>
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-image">
            {/* Show trending Just Chatting clip thumbnail or loading/fallback */}
            {loadingClip ? (
              <div className="image-placeholder" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'#a1a1aa',fontSize:'1.2rem'}}>Loading...</div>
            ) : justChattingClip ? (
              <div className="clip-preview-img-wrap" style={{position:'relative',width:'100%',height:'400px',borderRadius:'1.5rem',overflow:'hidden',background:'#232336'}}>
                {playingClip ? (
                  <>
                    <iframe
                      src={justChattingClip.embed_url + '&parent=' + window.location.hostname}
                      title={justChattingClip.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      style={{width:'100%',height:'100%',border:'none',borderRadius:'1.5rem'}}
                    />
                    <button
                      style={{position:'absolute',top:'1rem',right:'1rem',background:'rgba(0,0,0,0.7)',color:'#fff',border:'none',borderRadius:'50%',width:'2.5rem',height:'2.5rem',fontSize:'1.5rem',cursor:'pointer',zIndex:3,display:'flex',alignItems:'center',justifyContent:'center'}}
                      onClick={() => setPlayingClip(false)}
                      aria-label="Close Clip"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      src={justChattingClip.thumbnail_url}
                      alt={justChattingClip.title}
                      style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'1.5rem'}}
                    />
                    <button
                      className="clip-play-btn"
                      style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.6)',border:'none',borderRadius:'50%',padding:'1.2rem',cursor:'pointer',zIndex:2}}
                      onClick={() => setPlayingClip(true)}
                      aria-label="Play Clip"
                    >
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="18" fill="#a78bfa" fillOpacity="0.85"/>
                        <polygon points="14,11 27,18 14,25" fill="#fff"/>
                      </svg>
                    </button>
                    <div style={{position:'absolute',bottom:'1rem',left:'1rem',color:'#fff',background:'rgba(0,0,0,0.5)',padding:'0.5rem 1rem',borderRadius:'0.75rem',fontWeight:600,maxWidth:'80%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {justChattingClip.title}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="image-placeholder" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'#a1a1aa',fontSize:'1.2rem'}}>No trending clip found</div>
            )}
          </div>
        </section>

        {/* Features Section - Grid layout inspired by LCS */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose ClipScout?</h2>
            <p className="section-description">Everything you need to stay on top of Twitch trends</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3 className="feature-title">Trending Clips</h3>
              <p className="feature-description">Discover what's viral right now with our real-time trending algorithm</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗂️</div>
              <h3 className="feature-title">Organize</h3>
              <p className="feature-description">Create collections and folders for your favorite clips</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Smart Search</h3>
              <p className="feature-description">Find exactly what you're looking for with powerful filters</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Analytics</h3>
              <p className="feature-description">See which clips and creators are gaining traction</p>
            </div>
          </div>
        </section>

        {/* Highlight Section - Similar to LCS "Our Initiatives" */}
        <section className="highlight-section">
          <div className="highlight-content">
            <h2 className="highlight-title">Never Miss a Viral Moment</h2>
            <p className="highlight-description">Our advanced tracking ensures you're always in the loop when a clip starts gaining popularity across Twitch.</p>
            <ul className="highlight-list">
              <li>Real-time notifications for trending clips</li>
              <li>Customizable alerts for your favorite streamers</li>
              <li>Daily/weekly digest emails</li>
            </ul>
          </div>
          <div className="highlight-image">
            {/* Placeholder for highlight image */}
            <div className="image-placeholder"></div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to Discover Amazing Twitch Clips?</h2>
          <p className="cta-description">Join thousands of users who never miss a viral moment</p>
          <button className="primary-btn large" onClick={onSignUp}>
            Sign Up Free
          </button>
        </section>
      </main>
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">ClipScout</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} ClipScout. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function AppRoutes({ session, setActiveTab, activeTab }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!session) {
    if (location.pathname === '/signup' || location.pathname === '/signin') {
      return (
        <AuthModal view={location.pathname === '/signup' ? 'sign_up' : 'sign_in'} />
      )
    }
    return (
      <Landing
        onSignUp={() => navigate('/signup')}
        onLogIn={() => navigate('/signin')}
      />
    )
  }

  return (
    <div className="app-root">
      <Header session={session} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-container">
        <div>
          {activeTab === 'trending' && <TrendingClipsFeed />}
          {activeTab === 'search' && <StreamerSearch />}
          {activeTab === 'library' && <ClipLibrary />}
          {activeTab === 'creators' && <TrendingCreators />}
        </div>
      </main>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('trending')
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <AppRoutes
              session={session}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
