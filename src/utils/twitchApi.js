// Mock Twitch API functions - in a real app, you'd use actual Twitch API calls
// For now, we'll simulate the API responses

const MOCK_CLIPS = [
  {
    id: '1',
    url: 'https://clips.twitch.tv/1',
    embed_url: 'https://clips.twitch.tv/embed?clip=1',
    broadcaster_id: '123',
    broadcaster_name: 'xQc',
    creator_id: '456',
    creator_name: 'clip_creator',
    video_id: '789',
    game_id: '32982',
    language: 'en',
    title: 'xQc absolutely loses it over Minecraft',
    view_count: 15420,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    thumbnail_url: 'https://clips-media-assets2.twitch.tv/1-preview-480x272.jpg',
    duration: 30,
    vod_offset: 1234
  },
  {
    id: '2',
    url: 'https://clips.twitch.tv/2',
    embed_url: 'https://clips.twitch.tv/embed?clip=2',
    broadcaster_id: '124',
    broadcaster_name: 'Pokimane',
    creator_id: '457',
    creator_name: 'clip_creator2',
    video_id: '790',
    game_id: '32982',
    language: 'en',
    title: 'Pokimane reacts to insane Valorant play',
    view_count: 8920,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    thumbnail_url: 'https://clips-media-assets2.twitch.tv/2-preview-480x272.jpg',
    duration: 45,
    vod_offset: 5678
  },
  {
    id: '3',
    url: 'https://clips.twitch.tv/3',
    embed_url: 'https://clips.twitch.tv/embed?clip=3',
    broadcaster_id: '125',
    broadcaster_name: 'Ninja',
    creator_id: '458',
    creator_name: 'clip_creator3',
    video_id: '791',
    game_id: '33214',
    language: 'en',
    title: 'Ninja gets the most insane Fortnite win',
    view_count: 23450,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    thumbnail_url: 'https://clips-media-assets2.twitch.tv/3-preview-480x272.jpg',
    duration: 60,
    vod_offset: 9012
  },
  {
    id: '4',
    url: 'https://clips.twitch.tv/4',
    embed_url: 'https://clips.twitch.tv/embed?clip=4',
    broadcaster_id: '126',
    broadcaster_name: 'Shroud',
    creator_id: '459',
    creator_name: 'clip_creator4',
    video_id: '792',
    game_id: '32399',
    language: 'en',
    title: 'Shroud with the most insane CS2 clutch',
    view_count: 18760,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    thumbnail_url: 'https://clips-media-assets2.twitch.tv/4-preview-480x272.jpg',
    duration: 25,
    vod_offset: 3456
  },
  {
    id: '5',
    url: 'https://clips.twitch.tv/5',
    embed_url: 'https://clips.twitch.tv/embed?clip=5',
    broadcaster_id: '127',
    broadcaster_name: 'Ludwig',
    creator_id: '460',
    creator_name: 'clip_creator5',
    video_id: '793',
    game_id: '32982',
    language: 'en',
    title: 'Ludwig absolutely destroys in chess tournament',
    view_count: 12340,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    thumbnail_url: 'https://clips-media-assets2.twitch.tv/5-preview-480x272.jpg',
    duration: 40,
    vod_offset: 7890
  }
]

// Calculate virality score based on view count and recency
export const calculateViralityScore = (viewCount, createdAt) => {
  const now = new Date()
  const created = new Date(createdAt)
  const hoursSinceCreation = (now - created) / (1000 * 60 * 60)
  
  // Higher score for more recent clips and higher view counts
  // Formula: (view_count * 100) / (hours_since_creation + 1)
  return Math.round((viewCount * 100) / (hoursSinceCreation + 1))
}

// Generate tags based on title keywords
export const generateTags = (title) => {
  const titleLower = title.toLowerCase()
  const tags = []
  
  // Gaming tags
  if (titleLower.includes('minecraft')) tags.push('Minecraft')
  if (titleLower.includes('fortnite')) tags.push('Fortnite')
  if (titleLower.includes('valorant')) tags.push('Valorant')
  if (titleLower.includes('cs2') || titleLower.includes('counter-strike')) tags.push('CS2')
  if (titleLower.includes('chess')) tags.push('Chess')
  
  // Reaction tags
  if (titleLower.includes('loses') || titleLower.includes('rage') || titleLower.includes('angry')) tags.push('Rage')
  if (titleLower.includes('reacts') || titleLower.includes('reaction')) tags.push('Reaction')
  if (titleLower.includes('insane') || titleLower.includes('crazy') || titleLower.includes('amazing')) tags.push('Insane')
  if (titleLower.includes('funny') || titleLower.includes('laugh') || titleLower.includes('comedy')) tags.push('Funny')
  if (titleLower.includes('drama') || titleLower.includes('controversy')) tags.push('Drama')
  
  // Default tag if no specific tags found
  if (tags.length === 0) tags.push('Gaming')
  
  return tags
}

const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
let TWITCH_ACCESS_TOKEN = null;
let TWITCH_TOKEN_EXPIRES = 0;

async function getTwitchAccessToken() {
  const now = Date.now();
  if (TWITCH_ACCESS_TOKEN && now < TWITCH_TOKEN_EXPIRES) {
    return TWITCH_ACCESS_TOKEN;
  }
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  TWITCH_ACCESS_TOKEN = data.access_token;
  TWITCH_TOKEN_EXPIRES = now + (data.expires_in - 60) * 1000; // expire 1 min early
  return TWITCH_ACCESS_TOKEN;
}

async function getUserIdByName(username) {
  const token = await getTwitchAccessToken();
  const res = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(username)}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].id;
  }
  return null;
}

export const fetchTrendingClips = async (category = 'Just Chatting', language = '') => {
  // Fetch trending clips from the specified category in the last 24h
  const token = await getTwitchAccessToken();
  
  // 1. Get the game_id for the specified category
  const gameRes = await fetch(`https://api.twitch.tv/helix/games?name=${encodeURIComponent(category)}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
    },
  });
  const gameData = await gameRes.json();
  if (!gameData.data || gameData.data.length === 0) {
    console.log(`No game found for category: ${category}`);
    return [];
  }
  const gameId = gameData.data[0].id;
  
  // 2. Fetch clips for the game_id
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let clipsUrl = `https://api.twitch.tv/helix/clips?game_id=${gameId}&first=20&started_at=${yesterday}`;
  
  // Add language filter if specified
  if (language) {
    clipsUrl += `&language=${language}`;
  }
  
  const clipsRes = await fetch(clipsUrl, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
    },
  });
  const clipsData = await clipsRes.json();
  if (!clipsData.data) return [];
  
  // 3. Map, score, and sort
  const allClips = clipsData.data.map(clip => ({
    ...clip,
    broadcaster_name: clip.broadcaster_name,
    virality_score: calculateViralityScore(clip.view_count, clip.created_at),
    tags: generateTags(clip.title),
  }));
  allClips.sort((a, b) => b.virality_score - a.virality_score);
  return allClips;
}

export const fetchStreamerClips = async (streamerName) => {
  const token = await getTwitchAccessToken();
  const userId = await getUserIdByName(streamerName);
  if (!userId) return [];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const res = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${userId}&first=20&started_at=${yesterday}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!data.data) return [];
  return data.data.map(clip => ({
    ...clip,
    broadcaster_name: streamerName,
    virality_score: calculateViralityScore(clip.view_count, clip.created_at),
    tags: generateTags(clip.title),
  }));
} 