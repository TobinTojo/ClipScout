import React, { useEffect, useState } from 'react';
import { fetchTrendingClips, fetchStreamerClips, fetchUserInfoByName, fetchTopCategories, MOCK_CLIPS } from '../utils/twitchApi';

function TrendingCreators() {
  const [topStreamers, setTopStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('Just Chatting');
  const [searchInput, setSearchInput] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Fetch real categories from Twitch API on mount
    async function loadCategories() {
      const cats = await fetchTopCategories();
      setAllCategories(cats);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    loadTrendingCreators(category);
    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    if (!searchInput) {
      setCategorySuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const inputLower = searchInput.toLowerCase();
    const suggestions = allCategories.filter(cat => cat.name.toLowerCase().includes(inputLower));
    setCategorySuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, [searchInput, allCategories]);

  async function loadTrendingCreators(category) {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch trending clips for the selected category
      const trendingClips = await fetchTrendingClips(category);
      if (!trendingClips || trendingClips.length === 0) throw new Error('No trending clips found');
      // 2. Extract top 10 unique streamer names
      const uniqueStreamers = [];
      const seen = new Set();
      for (const clip of trendingClips) {
        if (!seen.has(clip.broadcaster_name)) {
          uniqueStreamers.push(clip.broadcaster_name);
          seen.add(clip.broadcaster_name);
        }
        if (uniqueStreamers.length >= 10) break;
      }
      // 3. For each streamer, fetch their recent clips and user info
      const streamerStats = await Promise.all(uniqueStreamers.map(async (name) => {
        try {
          const [clips, userInfo] = await Promise.all([
            fetchStreamerClips(name),
            fetchUserInfoByName(name)
          ]);
          if (!clips || clips.length === 0 || !userInfo) return null;
          const avgViews = Math.round(clips.reduce((sum, c) => sum + c.view_count, 0) / clips.length);
          return {
            name,
            avgViews,
            totalClips: clips.length,
            profileImage: userInfo.profile_image_url,
            displayName: userInfo.display_name,
          };
        } catch {
          return null;
        }
      }));
      // 4. Filter out any nulls and sort by avgViews
      const filtered = streamerStats.filter(Boolean).sort((a, b) => b.avgViews - a.avgViews);
      setTopStreamers(filtered);
    } catch (err) {
      setError('Failed to fetch Twitch data, showing mock data.');
      // Fallback: use mock data, aggregate by broadcaster_name
      const creatorMap = {};
      for (const clip of MOCK_CLIPS) {
        const name = clip.broadcaster_name;
        if (!creatorMap[name]) {
          creatorMap[name] = { totalViews: 0, count: 0 };
        }
        creatorMap[name].totalViews += clip.view_count;
        creatorMap[name].count += 1;
      }
      const creatorsArr = Object.entries(creatorMap).map(([name, data]) => ({
        name,
        avgViews: Math.round(data.totalViews / data.count),
        totalClips: data.count,
        profileImage: '',
        displayName: name,
      }));
      setTopStreamers(creatorsArr.sort((a, b) => b.avgViews - a.avgViews).slice(0, 10));
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCategory(searchInput.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cat) => {
    setSearchInput(cat.name);
    setCategory(cat.name);
    setShowSuggestions(false);
  };

  const getRowStyle = (idx) => {
    if (idx === 0) return { background: 'linear-gradient(90deg, #ffd700 0%, #fffbe6 100%)', color: '#232336', fontWeight: 'bold' };
    if (idx === 1) return { background: 'linear-gradient(90deg, #c0c0c0 0%, #f5f5f5 100%)', color: '#232336', fontWeight: 'bold' };
    if (idx === 2) return { background: 'linear-gradient(90deg, #cd7f32 0%, #fbeee0 100%)', color: '#232336', fontWeight: 'bold' };
    return {};
  };
  const getRankStyle = (idx) => {
    if (idx === 0) return { color: '#ffd700', fontWeight: 'bold' };
    if (idx === 1) return { color: '#c0c0c0', fontWeight: 'bold' };
    if (idx === 2) return { color: '#cd7f32', fontWeight: 'bold' };
    return {};
  };
  const getRankIcon = (idx) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return null;
  };

  const getRankCell = (idx) => {
    if (idx === 0) return <span style={{ color: '#ffd700', fontWeight: 'bold' }}>🥇</span>;
    if (idx === 1) return <span style={{ color: '#c0c0c0', fontWeight: 'bold' }}>🥈</span>;
    if (idx === 2) return <span style={{ color: '#cd7f32', fontWeight: 'bold' }}>🥉</span>;
    return idx + 1;
  };

  return (
    <div className="card-pro">
      <h2 className="text-2xl font-bold mb-4" style={{color:'#a78bfa'}}>🌟 Trending Creators (Top 10 Streamers)</h2>
      <div className="mb-4">
        <span className="inline-block bg-[#232336] text-[#a78bfa] px-3 py-1 rounded-full text-sm font-semibold">
          Category: {category}
        </span>
      </div>
      <div className="trending-search-bar-wrap">
        <form onSubmit={handleSearch} className="mb-6 flex gap-2 relative w-full" style={{maxWidth: '100%'}}>
          <input
            type="text"
            className="input-pro w-full"
            placeholder="Search content category (e.g., Just Chatting, Valorant)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onFocus={() => setShowSuggestions(categorySuggestions.length > 0)}
            disabled={loading}
            autoComplete="off"
            style={{maxWidth: '100%'}}
          />
          <button className="btn-pro" type="submit" disabled={loading || !searchInput.trim()}>Search</button>
          {showSuggestions && (
            <div className="filter-dropdown absolute left-0 top-full z-10 bg-[#232336] border border-[#2a2a40] rounded-xl mt-1 w-full max-h-48 overflow-y-auto">
              {categorySuggestions.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="filter-dropdown-item px-4 py-2 cursor-pointer hover:bg-[#a78bfa] hover:text-white flex items-center gap-2"
                  onClick={() => handleSuggestionClick(cat)}
                >
                  {cat.boxArtUrl && (
                    <img src={cat.boxArtUrl.replace('{width}', '40').replace('{height}', '54')} alt={cat.name} style={{width:24, height:32, borderRadius:4, objectFit:'cover'}} />
                  )}
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      {loading && <div className="text-center py-8"><span className="loader"></span> Loading...</div>}
      {error && <div className="save-clip-error mb-2">{error}</div>}
      {!loading && (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2 text-center">#</th>
              <th className="pb-2 text-center">Streamer</th>
              <th className="pb-2 text-center">Avg Views</th>
              <th className="pb-2 hide-mobile text-center">Total Clips</th>
            </tr>
          </thead>
          <tbody>
            {topStreamers.map((creator, idx) => (
              <tr key={creator.name} className="border-b border-[#2a2a40]">
                <td className="py-2 pr-4 text-center" style={getRankStyle(idx)}>
                  {getRankCell(idx)}
                </td>
                <td className="py-2 pr-4 font-bold flex items-center gap-2 text-center" style={getRankStyle(idx)}>
                  {creator.profileImage && (
                    <img src={creator.profileImage} alt={creator.displayName} style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', border:'2px solid #a78bfa'}} />
                  )}
                  {creator.displayName || creator.name}
                </td>
                <td className="py-2 pr-4 text-center">{creator.avgViews.toLocaleString()}</td>
                <td className="py-2 hide-mobile text-center">{creator.totalClips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TrendingCreators; 