import type { LucideIcon } from 'lucide-react'
import {
  AppWindow,
  BrainCircuit,
  ChartLine,
  Settings,
  Terminal,
} from 'lucide-react'

export type SkillGroupId = 'programming' | 'ai-ml' | 'data' | 'web' | 'tools'

export interface SkillGroup {
  id: SkillGroupId
  title: string
  accent: 'cyan' | 'violet'
  icon: LucideIcon
}

export interface Skill {
  name: string
  description: string
  group: SkillGroupId
  /** Constellation position in % of the stage (desktop only) */
  x: number
  y: number
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    title: 'Programming & Core',
    accent: 'cyan',
    icon: Terminal,
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    accent: 'violet',
    icon: BrainCircuit,
  },
  {
    id: 'data',
    title: 'Data Analytics & Engineering',
    accent: 'cyan',
    icon: ChartLine,
  },
  {
    id: 'web',
    title: 'Web & APIs',
    accent: 'violet',
    icon: AppWindow,
  },
  {
    id: 'tools',
    title: 'Developer Tools',
    accent: 'cyan',
    icon: Settings,
  },
]

export const skills: Skill[] = [
  // Programming
  {
    name: 'Python',
    description: 'Primary language for data analysis, ML and AI applications.',
    group: 'programming',
    x: 11,
    y: 64,
  },
  {
    name: 'SQL',
    description: 'Querying and working with relational data.',
    group: 'programming',
    x: 19,
    y: 77,
  },

  // AI & ML
  {
    name: 'Machine Learning',
    description:
      'Building predictive models with classical ML workflows and scikit-learn.',
    group: 'ai-ml',
    x: 31,
    y: 28,
  },
  {
    name: 'Generative AI',
    description: 'LLM tools, prompting and practical AI-powered applications.',
    group: 'ai-ml',
    x: 42,
    y: 40,
  },
  { name: 'Linear Regression', description: 'Regression method used for trend estimation in the featured market project.', group: 'ai-ml', x: 38, y: 52 },
  { name: 'scikit-learn', description: 'Python machine-learning library used for model workflows.', group: 'ai-ml', x: 45, y: 60 },

  // Data & Analytics
  {
    name: 'Power BI',
    description:
      'Interactive dashboards and business intelligence reporting.',
    group: 'data',
    x: 61,
    y: 16,
  },
  {
    name: 'Pandas',
    description: 'Data wrangling, cleaning and exploratory analysis.',
    group: 'data',
    x: 53,
    y: 31,
  },
  {
    name: 'NumPy',
    description: 'Numerical computing and array operations.',
    group: 'data',
    x: 64,
    y: 35,
  },
  { name: 'Data Pipelines', description: 'Organizing data movement and preparation for analysis.', group: 'data', x: 68, y: 45 },

  // Web
  {
    name: 'React.js',
    description: 'Component-driven interactive user interfaces.',
    group: 'web',
    x: 26,
    y: 70,
  },
  {
    name: 'Flask',
    description: 'Python APIs and backend services for AI applications.',
    group: 'web',
    x: 33,
    y: 85,
  },
  {
    name: 'HTML/CSS',
    description: 'Semantic page structure, styling and responsive layouts.',
    group: 'web',
    x: 41,
    y: 74,
  },
  {
    name: 'JavaScript',
    description: 'Modern browser scripting and interactivity.',
    group: 'web',
    x: 56,
    y: 74,
  },
  { name: 'REST APIs', description: 'Designing and consuming HTTP APIs between frontend and backend services.', group: 'web', x: 62, y: 86 },

  // Tools
  {
    name: 'Git',
    description: 'Version control and history management.',
    group: 'tools',
    x: 76,
    y: 58,
  },
  {
    name: 'GitHub',
    description: 'Hosting repositories and collaborating on code.',
    group: 'tools',
    x: 86,
    y: 65,
  },
  {
    name: 'VS Code',
    description: 'Daily development environment.',
    group: 'tools',
    x: 78,
    y: 77,
  },
  { name: 'Postman', description: 'Sending requests and inspecting API responses during development.', group: 'tools', x: 88, y: 81 },
]

/**
 * Constellation edges — intra-group chains plus a few curated
 * cross-group bridges (Python→ML, SQL→Flask, GenAI→Power BI, Python→React).
 */
export const skillLinks: [string, string][] = [
  // Programming
  ['Python', 'SQL'],

  // AI & ML
  ['Machine Learning', 'Generative AI'],

  // Data
  ['Power BI', 'Pandas'],
  ['Pandas', 'NumPy'],

  // Web
  ['React.js', 'Flask'],
  ['Flask', 'HTML/CSS'],
  ['HTML/CSS', 'JavaScript'],

  // Tools
  ['Git', 'GitHub'],
  ['GitHub', 'VS Code'],

  // Cross-group bridges
  ['Python', 'Machine Learning'],
  ['SQL', 'Flask'],
  ['Generative AI', 'Power BI'],
  ['Python', 'React.js'],
]
