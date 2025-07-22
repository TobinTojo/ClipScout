import { useState, useEffect } from 'react'
import { supabase } from './utils/supabaseClient'
import TrendingClipsFeed from './components/TrendingClipsFeed'
import StreamerSearch from './components/StreamerSearch'
import Header from './components/Header'
import ClipLibrary from './components/ClipLibrary'
import TrendingCreators from './components/TrendingCreators';

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

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181b]">
        <div className="card-pro max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4" style={{color:'#a78bfa'}}>Sign in to ClipScout</h2>
          <AuthUI />
        </div>
      </div>
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

// Supabase Auth UI component
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
function AuthUI() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google']}
      theme="dark"
    />
  )
}

export default App
