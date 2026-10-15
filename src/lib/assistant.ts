/**
 * Ask Ragul AI — local, deterministic answer engine.
 *
 * Runs entirely in the browser against verified portfolio data.
 * No LLM calls, no API keys, no network requests.
 * The shape (query → retrieved answer + suggestions) mirrors a RAG
 * pipeline so a Flask/Node API with vector search + an LLM can be
 * dropped in later without changing the UI contract.
 */

import { certificates } from '../data/certificates'
import { experiences } from '../data/experience'
import { profile } from '../data/profile'
import { marketTracker } from '../data/projects'
import { skillGroups, skills } from '../data/skills'

export type AssistantMode = 'general' | 'project'

export interface KnowledgeEntry {
  id: string
  /** Which modes this entry is available in */
  modes: AssistantMode[]
  keywords: string[]
  answer: string
}

const skillSummary = skillGroups
  .map((group) => {
    const names = skills
      .filter((skill) => skill.group === group.id)
      .map((skill) => skill.name)
      .join(', ')
    return `${group.title}: ${names}`
  })
  .join('\n')

const experienceSummary = experiences
  .flatMap((group) =>
    group.roles.map(
      (role) => `• ${group.company} — ${role.role} (${role.period})`,
    ),
  )
  .join('\n')

const certificateSummary = certificates
  .map((cert) => `• ${cert.organization} — ${cert.title}`)
  .join('\n')

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'identity',
    modes: ['general'],
    keywords: [
      'who is ragul',
      'about ragul',
      'tell me about ragul',
      'who are you',
      'yourself',
      'background',
      'introduce',
      'hello',
      'hi there',
      'hey there',
    ],
    answer: `I'm Ask Ragul AI, a local demo assistant for ${profile.fullName}'s portfolio.\n\n${profile.fullName} is a ${profile.heroTitle} at ${profile.institution} (expected graduation ${profile.graduation}, CGPA ${profile.cgpa}), focused on Machine Learning, Data Analytics, Generative AI and practical AI systems — open to internships and entry-level roles.`,
  },
  {
    id: 'assistant-identity',
    modes: ['general', 'project'],
    keywords: [
      'how do you work',
      'are you chatgpt',
      'are you real ai',
      'are you an ai',
      'api key',
      'backend',
      'llm',
      'rag',
      'vector',
      'hallucinate',
    ],
    answer:
      'I run entirely in your browser as a local demo: keyword retrieval over Ragul’s verified portfolio data — no external AI API, no API keys, no network calls, so I never invent answers. The interface is built to connect later to a Flask/Node API with a vector database, RAG and an LLM for live generative answers.',
  },
  {
    id: 'projects',
    modes: ['general'],
    keywords: [
      'project',
      'built',
      'build',
      'portfolio work',
      'made',
      'developed',
      'showcase',
    ],
    answer: `Ragul’s featured project is ${marketTracker.title} — ${marketTracker.description}\n\nLive: ${marketTracker.links.demo}\nGitHub: ${marketTracker.links.github}\n\nMore code: ${profile.github}`,
  },
  {
    id: 'market',
    modes: ['general'],
    keywords: [
      'market ai',
      'tracker',
      'stock',
      'trading',
      'candlestick',
      'rsi',
      'sma',
      'dashboard',
      'indicator',
      'prediction',
    ],
    answer: `${marketTracker.title} is an AI-powered stock market analytics platform.\n\n• Candlestick chart with SMA20 & SMA50 overlays\n• AI prediction line with confidence levels\n• Buy/Sell signals with alerts\n• RSI momentum + SMA crossover detection\n• 14-day forecast\n\nStack: ${marketTracker.tech.join(' • ')}\n\nLive: ${marketTracker.links.demo} · Forecasts are statistical estimates, not financial advice.`,
  },
  {
    id: 'skills',
    modes: ['general'],
    keywords: [
      'skill',
      'skillset',
      'technology',
      'technologies',
      'tech stack',
      'stack',
      'tools',
      'programming',
      'python',
      'sql',
      'power bi',
      'know',
      'languages',
    ],
    answer: `Ragul’s technical skills:\n\n${skillSummary}`,
  },
  {
    id: 'experience',
    modes: ['general'],
    keywords: [
      'internship',
      'intern',
      'experience',
      'work',
      'company',
      'growfinix',
      'novitech',
      'corizo',
      'training',
      'masterclass',
      'job',
      'employed',
    ],
    answer: `Internships & training completed:\n\n${experienceSummary}\n\nGrowfinix topics: Exploratory Data Analysis, Web Scraping, Streamlit Dashboard, SQL/Data Pipeline work, A/B Testing.`,
  },
  {
    id: 'certifications',
    modes: ['general'],
    keywords: [
      'certificate',
      'certification',
      'certifications',
      'certified',
      'course',
      'workshop',
      'credential',
      'deloitte',
      'infosys',
      'tata',
      'forage',
    ],
    answer: `Ragul holds ${certificates.length} certifications:\n\n${certificateSummary}\n\nScroll to the Certifications section to view each certificate image.`,
  },
  {
    id: 'roles',
    modes: ['general'],
    keywords: [
      'role',
      'interested',
      'interest',
      'open to',
      'looking for',
      'seeking',
      'career',
      'goal',
      'hire',
      'opportunity',
      'opportunities',
      'position',
      'job title',
      'future',
    ],
    answer: `Ragul is open to Internship & Entry-Level opportunities and is interested in: ${profile.interests.join(', ')}.\n\nHeadline: ${profile.headline}`,
  },
  {
    id: 'education',
    modes: ['general'],
    keywords: [
      'education',
      'degree',
      'college',
      'institute',
      'university',
      'school',
      'cgpa',
      'gpa',
      'graduation',
      'study',
      'btech',
      'b.tech',
      'rvs',
      'course of study',
    ],
    answer: `${profile.degree}\n${profile.institution}\n\nCGPA: ${profile.cgpa}\nExpected graduation: ${profile.graduation}`,
  },
  {
    id: 'contact',
    modes: ['general'],
    keywords: [
      'contact',
      'email',
      'reach',
      'linkedin',
      'github',
      'connect',
      'touch',
      'message',
      'phone',
      'number',
      'whatsapp',
    ],
    answer: `You can reach Ragul at:\n\nEmail: ${profile.email}\nLinkedIn: ${profile.linkedin}\nGitHub: ${profile.github}\n\n(No phone number is published on this portfolio.)`,
  },
  {
    id: 'resume',
    modes: ['general'],
    keywords: ['resume', 'cv', 'download', 'pdf'],
    answer: `Ragul’s resume is available as "${profile.resume.filename}" — use the VIEW RESUME / DOWNLOAD RESUME actions in the hero section (served at ${profile.resume.href}).`,
  },

  /* ---------- Project-mode entries (Market AI Tracker) ---------- */
  {
    id: 'project-overview',
    modes: ['project'],
    keywords: [
      'what is',
      'overview',
      'about this',
      'tell me',
      'project',
      'market',
      'describe',
    ],
    answer: `${marketTracker.title} — ${marketTracker.description}\n\nStack: ${marketTracker.tech.join(' • ')}\n\nLive: ${marketTracker.links.demo}\nGitHub: ${marketTracker.links.github}\n\n${marketTracker.disclaimer}`,
  },
  ...marketTracker.explainer.map<KnowledgeEntry>((item) => {
    const lower = item.question.toLowerCase()
    let keywords: string[]

    if (lower.includes('problem')) {
      keywords = ['problem', 'solve', 'purpose', 'why', 'what does it do', 'goal']
    } else if (lower.includes('technolog')) {
      keywords = [
        'technology',
        'technologies',
        'tech',
        'stack',
        'built with',
        'framework',
        'library',
        'libraries',
        'language',
        'react',
        'flask',
        'python',
      ]
    } else if (lower.includes('forecasting')) {
      keywords = [
        'forecast',
        'forecasting',
        'predict',
        'prediction',
        'model',
        'regression',
        'confidence',
        'how does',
        'algorithm',
        'ml',
        'machine learning',
      ]
    } else {
      keywords = ['feature', 'features', 'can it', 'what can', 'include']
    }

    return {
      id: `project-${lower.slice(0, 12).replace(/\s+/g, '-')}`,
      modes: ['project', 'general'],
      keywords,
      answer: item.answer,
    }
  }),
]

const FALLBACK_GENERAL =
  'I only answer from Ragul’s verified portfolio data, and I don’t have an answer for that one. Try one of the suggested questions — or email ragulg45678@gmail.com directly.'

const FALLBACK_PROJECT =
  'I can only answer questions about Market AI Tracker from its confirmed documentation. Try one of the suggested questions — or open the repository at github.com/RAGULG19/Market-AI-Tracker for full details.'

export const generalSuggestions = [
  'Who is Ragul?',
  'What are his skills?',
  'What projects has he built?',
  'What is Market AI Tracker?',
  'What roles is he looking for?',
  'What certifications does he have?',
  'How can I contact Ragul?',
]

export const projectSuggestions = [
  'What problem does it solve?',
  'What technologies are used?',
  'How does forecasting work?',
  'What are the main features?',
]

export const assistantGreeting: Record<AssistantMode, string> = {
  general:
    'Hi — I’m Ask Ragul AI. Ask me about Ragul’s projects, skills, internships, certifications or education. Everything I answer comes from verified portfolio data.',
  project:
    'Ask me anything about Market AI Tracker — its problem, stack, forecasting approach and features. Answers come from the project’s confirmed documentation.',
}

export interface AssistantAnswer {
  text: string
}

/** Keyword-retrieval stand-in for a future RAG pipeline. */
export function answerQuestion(
  question: string,
  mode: AssistantMode,
): AssistantAnswer {
  const query = question.toLowerCase().trim()

  if (!query) {
    return { text: FALLBACK_GENERAL }
  }

  const candidates = knowledgeBase.filter((entry) =>
    entry.modes.includes(mode),
  )

  let best: KnowledgeEntry | null = null
  let bestScore = 0

  for (const entry of candidates) {
    let score = 0

    for (const keyword of entry.keywords) {
      if (query.includes(keyword)) {
        // Longer keywords are more specific → weigh them higher.
        score += keyword.includes(' ') ? 3 : 2
      }
    }

    if (score > bestScore) {
      best = entry
      bestScore = score
    }
  }

  if (!best) {
    return { text: mode === 'project' ? FALLBACK_PROJECT : FALLBACK_GENERAL }
  }

  return { text: best.answer }
}
