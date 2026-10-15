/**
 * Real internships / training programs, grouped by organization.
 * Every role, date and topic below is verified — nothing invented.
 * Grouping preserves ALL original entries (6 roles across 3 orgs).
 */

export interface ExperienceRole {
  role: string
  period: string
  /** Only present where responsibilities were officially documented. */
  topics?: string[]
}

export interface ExperienceItem {
  id: string
  company: string
  roles: ExperienceRole[]
}

export const experiences: ExperienceItem[] = [
  {
    id: 'growfinix',
    company: 'GROWFINIX TECH',
    roles: [
      {
        role: 'Data Science / Analytics Internship',
        period: '14 June 2026 – 14 July 2026',
        topics: [
          'Exploratory Data Analysis',
          'Web Scraping',
          'Streamlit Dashboard',
          'SQL / Data Pipeline work',
          'A/B Testing',
        ],
      },
    ],
  },
  {
    id: 'novitech',
    company: 'NOVITECH',
    roles: [
      {
        role: 'Artificial Intelligence Internship',
        period: '28 July 2025 – 28 August 2025',
      },
      {
        role: 'Machine Learning Internship',
        period: '28 July 2025 – 28 August 2025',
      },
      {
        role: '30 Days MasterClass in Data Analytics',
        period: '28 July 2025 – 1 September 2025',
      },
    ],
  },
  {
    id: 'corizo',
    company: 'CORIZO',
    roles: [
      {
        role: 'UI/UX Design Internship',
        period: '5 October 2024 – 5 November 2024',
      },
      {
        role: 'UI/UX Design Training',
        period: '5 September 2024 – 5 October 2024',
      },
    ],
  },
]
