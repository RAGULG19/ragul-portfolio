/**
 * Verified personal profile — single source of truth.
 * No invented facts: location and phone number are intentionally omitted.
 */

export const profile = {
  name: 'RAGUL G',
  fullName: 'Ragul G',

  heroTitle: 'Final-Year AI & Data Science Student',
  supportingTitle: 'Machine Learning | Data Analytics | Generative AI',
  tagline: 'Turning Data Into Intelligence.',
  description:
    'Final-year Artificial Intelligence and Data Science student focused on building data-driven solutions, machine learning applications, intelligent dashboards, and practical AI systems.',
  headline:
    'AI & Data Science Student | Python • SQL • Machine Learning • Generative AI • Power BI | Building AI & Data-Driven Solutions | Open to Internships & Entry-Level Roles',

  techLine: [
    'Python',
    'SQL',
    'Machine Learning',
    'Generative AI',
    'Power BI',
    'React.js',
    'Flask',
  ],

  badges: [
    'Final-Year AI & Data Science Student',
    'Open to Internship & Entry-Level Opportunities',
  ],

  degree: 'B.Tech Artificial Intelligence & Data Science',
  institution: 'RVS Institute of Technology',
  cgpa: '8.25',
  graduation: '2027',
  batch: '2023–2027',

  email: 'ragulg45678@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ragulg07',
  github: 'https://github.com/RAGULG19',

  resume: {
    href: '/resume.pdf',
    filename: 'Ragul-G-Resume.pdf',
  },

  interests: [
    'Machine Learning',
    'Data Analytics',
    'Data Science',
    'Generative AI',
    'Business Intelligence',
    'AI-powered Applications',
  ],
} as const

export type Profile = typeof profile
