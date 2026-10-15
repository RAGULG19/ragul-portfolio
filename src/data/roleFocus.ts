export type RecruiterRole = 'all' | 'ai-ml' | 'data-analyst' | 'python-developer'

export const recruiterRoles: { id: RecruiterRole; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai-ml', label: 'AI / ML Engineer' },
  { id: 'data-analyst', label: 'Data Analyst' },
  { id: 'python-developer', label: 'Python Developer' },
]

export const roleFocus: Record<Exclude<RecruiterRole, 'all'>, {
  skills: string[]
  certificates: string[]
  projectFeatures: string[]
}> = {
  'ai-ml': {
    skills: ['Python', 'Machine Learning', 'Generative AI', 'Linear Regression', 'scikit-learn', 'Pandas', 'NumPy'],
    certificates: ['Data Science Internship', 'Generative AI Workshop', 'Artificial Intelligence Internship', 'Machine Learning Internship', 'GenAI Powered Data Analytics Job Simulation'],
    projectFeatures: ['AI prediction line with confidence levels', 'Buy/Sell signals with alerts', 'RSI-based momentum analysis', 'SMA20 & SMA50 crossover detection', '14-day forecast', 'Real-time AI Assistant for school queries'],
  },
  'data-analyst': {
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Power BI', 'Data Pipelines'],
    certificates: ['Data Analytics Job Simulation', 'Data Science Internship', 'Power BI Bootcamp', 'AI Dashboards using Microsoft Power BI', '30 Days MasterClass in Data Analytics', 'GenAI Powered Data Analytics Job Simulation'],
    projectFeatures: ['Candlestick chart with SMA20 & SMA50 overlays', 'RSI-based momentum analysis', 'SMA20 & SMA50 crossover detection', 'Historical market trend visualization'],
  },
  'python-developer': {
    skills: ['Python', 'Flask', 'REST APIs', 'React.js', 'JavaScript', 'Git', 'GitHub', 'Postman'],
    certificates: ['Basics of Python', 'Master GitHub Like a Pro', 'Software Testing Workshop'],
    projectFeatures: ['Responsive modern dashboard UI', 'Real-time AI Assistant for school queries', 'Automated parent updates'],
  },
}

/** A value (skill name, certificate title or project feature) is
 *  highlighted for a role when it appears in ANY of the role's mappings. */
export function isRoleRelevant(role: RecruiterRole, values: readonly string[]) {
  if (role === 'all') return false
  const focus = roleFocus[role]
  return values.some((value) => focus.skills.includes(value)
    || focus.certificates.includes(value)
    || focus.projectFeatures.includes(value))
}
