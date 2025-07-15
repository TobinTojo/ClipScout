// Mock AI title generator - simulates rewriting clip titles to be more viral
// In a real app, this would use an LLM API like OpenAI or Claude

const VIRAL_TEMPLATES = [
  {
    keywords: ['loses', 'rage', 'angry', 'mad'],
    templates: [
      '{streamer} absolutely LOSES IT over {game} 😤',
      '{streamer} RAGES at {game} - you won\'t believe what happened! 🔥',
      'When {streamer} gets TOXIC in {game} 😱',
      '{streamer} has the BIGGEST meltdown in {game} history 💀'
    ]
  },
  {
    keywords: ['insane', 'crazy', 'amazing', 'unbelievable'],
    templates: [
      '{streamer} with the MOST INSANE {game} play ever! 🤯',
      'This {game} clip from {streamer} is ABSOLUTELY CRAZY 🔥',
      '{streamer} does the IMPOSSIBLE in {game} 😱',
      'You won\'t believe what {streamer} just did in {game}! 💯'
    ]
  },
  {
    keywords: ['reacts', 'reaction', 'shocked'],
    templates: [
      '{streamer} reacts to the CRAZIEST {game} moment 😲',
      'When {streamer} sees this {game} play... 😱',
      '{streamer}\'s reaction to this {game} clip is GOLD 😂',
      'Watch {streamer} lose their mind over this {game} play! 🤯'
    ]
  },
  {
    keywords: ['funny', 'laugh', 'comedy', 'joke'],
    templates: [
      '{streamer} says the FUNNIEST thing during {game} 😂',
      'This {game} moment from {streamer} is COMEDY GOLD 💀',
      '{streamer} makes everyone laugh with this {game} clip 🤣',
      'The most HILARIOUS {game} moment from {streamer} 😆'
    ]
  },
  {
    keywords: ['win', 'victory', 'clutch'],
    templates: [
      '{streamer} gets the MOST INSANE {game} win! 🏆',
      'This {game} clutch from {streamer} is LEGENDARY 🔥',
      '{streamer} pulls off the IMPOSSIBLE {game} victory 😱',
      'Watch {streamer} dominate in {game} like never before! 💪'
    ]
  }
]

const GAME_MAPPINGS = {
  'minecraft': 'Minecraft',
  'fortnite': 'Fortnite',
  'valorant': 'Valorant',
  'cs2': 'CS2',
  'counter-strike': 'CS2',
  'chess': 'Chess',
  'league of legends': 'LoL',
  'lol': 'LoL',
  'apex': 'Apex Legends',
  'apex legends': 'Apex Legends',
  'overwatch': 'Overwatch',
  'cod': 'Call of Duty',
  'call of duty': 'Call of Duty'
}

// Extract game from title or use default
const extractGame = (title) => {
  const titleLower = title.toLowerCase()
  
  for (const [key, value] of Object.entries(GAME_MAPPINGS)) {
    if (titleLower.includes(key)) {
      return value
    }
  }
  
  return 'Gaming' // Default fallback
}

// Generate a viral title based on the original title
export const generateViralTitle = (originalTitle, streamerName) => {
  const titleLower = originalTitle.toLowerCase()
  const game = extractGame(originalTitle)
  
  // Find matching template based on keywords
  for (const template of VIRAL_TEMPLATES) {
    if (template.keywords.some(keyword => titleLower.includes(keyword))) {
      const randomTemplate = template.templates[Math.floor(Math.random() * template.templates.length)]
      return randomTemplate
        .replace('{streamer}', streamerName)
        .replace('{game}', game)
    }
  }
  
  // Fallback template if no keywords match
  const fallbackTemplates = [
    '{streamer} with the MOST VIRAL {game} moment! 🔥',
    'This {game} clip from {streamer} is going VIRAL 😱',
    '{streamer} creates the BEST {game} content! 💯',
    'You need to see this {game} moment from {streamer}! 🤯'
  ]
  
  const randomFallback = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)]
  return randomFallback
    .replace('{streamer}', streamerName)
    .replace('{game}', game)
}

// Generate multiple title variations
export const generateTitleVariations = (originalTitle, streamerName, count = 3) => {
  const variations = []
  
  for (let i = 0; i < count; i++) {
    variations.push(generateViralTitle(originalTitle, streamerName))
  }
  
  return variations
}

// Real AI title generation (commented out for now)
/*
export const generateViralTitle = async (originalTitle, streamerName) => {
  const response = await fetch('/api/generate-title', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalTitle,
      streamerName,
      style: 'viral'
    })
  })
  
  const data = await response.json()
  return data.title
}
*/ 