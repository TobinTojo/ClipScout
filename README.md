# ClipScout 🔥

A serverless web app that helps Twitch clippers discover viral moments from streams to create their own edits and remixes.

## Features

### 🎯 Trending Clips Feed
- Fetches trending clips from the last 24 hours
- Displays clips with preview thumbnails, streamer info, and engagement metrics
- Shows virality score based on view count and recency
- Automatic tag generation based on clip content
- Sort by virality, views, or recency

### 🔍 Streamer Search
- Search for clips by Twitch streamer username
- View all clips from a specific streamer
- Same sorting and filtering options as trending feed
- Quick search suggestions for popular streamers

### 🎬 Clip Actions
- Cpen clip in new tab
- Share functionality ready for implementation

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: TailwindCSS
- **API**: Mock Twitch API (ready for real implementation)
- **AI**: Template-based title generation (ready for LLM integration)

## Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clipscout
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # App header with branding
│   ├── TrendingClipsFeed.jsx   # Trending clips display
│   ├── StreamerSearch.jsx      # Streamer search functionality
│   └── ClipCard.jsx           # Individual clip display
├── utils/
│   ├── twitchApi.js           # Twitch API utilities (mock)
│   └── titleGenerator.js      # AI title generation
├── App.jsx                    # Main app component
├── main.jsx                   # App entry point
└── index.css                  # TailwindCSS imports
```

## API Integration

### Current State
The app currently uses mock data to simulate Twitch API responses. This allows for full functionality testing without API keys.

### Real Twitch API Integration
To integrate with the real Twitch API:

1. Get Twitch API credentials:
   - Register at [Twitch Developer Console](https://dev.twitch.tv/console)
   - Create a new application
   - Get Client ID and generate Access Token

2. Update `src/utils/twitchApi.js`:
   - Uncomment the real API functions
   - Add your Client ID and Access Token
   - Remove mock data

3. API Endpoints used:
   - `GET /helix/clips` - Fetch trending clips
   - `GET /helix/clips` with broadcaster_id - Fetch streamer clips

## AI Title Generation

### Current Implementation
Uses template-based generation with:
- Keyword detection in clip titles
- Game identification
- Viral title patterns
- Emoji integration

### Real AI Integration
To integrate with real AI services:

1. **OpenAI GPT-4**:
```javascript
// In titleGenerator.js
export const generateViralTitle = async (originalTitle, streamerName) => {
  const response = await fetch('/api/generate-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalTitle, streamerName, style: 'viral' })
  })
  return response.json()
}
```

2. **Claude API**:
```javascript
// Similar implementation with Anthropic's Claude API
```

## Customization

### Styling
- All styling is done with TailwindCSS
- Color scheme: Dark theme with purple/pink accents
- Responsive design for mobile and desktop

### Adding New Features
- Easy to extend with new components
- Modular architecture for scalability
- Utility functions for reusability

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Environment variables for API keys

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Other Platforms
- Any static hosting service that supports React apps
- Build with `npm run build` and serve the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Roadmap

- [ ] Real Twitch API integration
- [ ] Real AI title generation
- [ ] User authentication
- [ ] Clip collections/favorites
- [ ] Advanced filtering options
- [ ] Mobile app version
- [ ] Social sharing integration
- [ ] Analytics dashboard

