import React from 'react';

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar flex gap-4 py-4 px-6 bg-[#232336] border-b border-[#2a2a40] mb-6 rounded-b-xl">
      <button
        onClick={() => setActiveTab('trending')}
        className={`tab-pro${activeTab === 'trending' ? ' active' : ''}`}
      >
        🔥 Trending Clips
      </button>
      <button
        onClick={() => setActiveTab('search')}
        className={`tab-pro${activeTab === 'search' ? ' active' : ''}`}
      >
        🔍 Streamer Search
      </button>
      <button
        onClick={() => setActiveTab('library')}
        className={`tab-pro${activeTab === 'library' ? ' active' : ''}`}
      >
        🗃 Clip Library
      </button>
      <button
        onClick={() => setActiveTab('creators')}
        className={`tab-pro${activeTab === 'creators' ? ' active' : ''}`}
      >
        🌟 Trending Creators
      </button>
    </nav>
  );
}

export default Navbar; 