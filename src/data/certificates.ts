/**
 * The 14 real certificates — images live in src/assets/certificates.
 * `takeaway` lines are derived ONLY from each certificate's verified
 * title / organization / date. No advanced skills, no exaggeration.
 */

import cert01 from '../assets/certificates/01-corizo-uiux-internship.jpg'
import cert02 from '../assets/certificates/02-corizo-uiux-training.jpg'
import cert03 from '../assets/certificates/03-deloitte-data-analytics.jpg'
import cert04 from '../assets/certificates/04-growfinix-data-science.jpg'
import cert05 from '../assets/certificates/05-techgyan-nit-trichy.jpg'
import cert06 from '../assets/certificates/06-letsupgrade-powerbi.jpg'
import cert07 from '../assets/certificates/07-skill-nation-powerbi.jpg'
import cert08 from '../assets/certificates/08-novitech-ai-internship.jpg'
import cert09 from '../assets/certificates/09-novitech-ml-internship.jpg'
import cert10 from '../assets/certificates/10-novitech-data-analytics.jpg'
import cert11 from '../assets/certificates/11-leadpro-software-testing.jpg'
import cert12 from '../assets/certificates/12-tata-forage-genai.jpg'
import cert13 from '../assets/certificates/13-infosys-python.jpg'
import cert14 from '../assets/certificates/14-novitech-github.jpg'

export interface Certificate {
  id: number
  title: string
  organization: string
  shortOrg: string
  date: string | null
  takeaway: string
  category: 'AI & Machine Learning' | 'Data Analytics & Power BI' | 'Software & Web'
  skillsValidated: string[]
  year: number | null
  image: string
}

export const certificates: Certificate[] = [
  {
    id: 1,
    title: 'UI/UX Design Internship',
    organization: 'Corizo',
    shortOrg: 'CORIZO',
    date: '05 Oct 2024 – 05 Nov 2024',
    takeaway:
      'Developed practical exposure to UI/UX design workflows and interface design principles.',
    category: 'Software & Web',
    skillsValidated: ['UI/UX design', 'Interface design'],
    year: 2024,
    image: cert01,
  },
  {
    id: 2,
    title: 'UI/UX Design Training',
    organization: 'Corizo',
    shortOrg: 'CORIZO',
    date: '05 Sep 2024 – 05 Oct 2024',
    takeaway:
      'Built foundational understanding of interface design thinking and user-focused design fundamentals.',
    category: 'Software & Web',
    skillsValidated: ['UI/UX design', 'User-focused design'],
    year: 2024,
    image: cert02,
  },
  {
    id: 3,
    title: 'Data Analytics Job Simulation',
    organization: 'Deloitte',
    shortOrg: 'DELOITTE',
    date: '14 Jun 2026',
    takeaway:
      'Applied core data analysis and reporting workflows to a simulated business scenario.',
    category: 'Data Analytics & Power BI',
    skillsValidated: ['Data analysis', 'Reporting'],
    year: 2026,
    image: cert03,
  },
  {
    id: 4,
    title: 'Data Science Internship',
    organization: 'Growfinix',
    shortOrg: 'GROWFINIX',
    date: '14 Jun 2026 – 14 Jul 2026',
    takeaway:
      'Practiced exploratory data analysis, web scraping and dashboard-building in a real data science internship.',
    category: 'AI & Machine Learning',
    skillsValidated: ['Exploratory data analysis', 'Web scraping', 'Dashboards'],
    year: 2026,
    image: cert04,
  },
  {
    id: 5,
    title: 'Generative AI Workshop',
    organization: 'Techgyan Technologies at NIT Trichy',
    shortOrg: 'TECHGYAN / NIT TRICHY',
    date: null,
    takeaway:
      'Explored generative AI concepts and practical applications of modern AI tools.',
    category: 'AI & Machine Learning',
    skillsValidated: ['Generative AI', 'AI tools'],
    year: null,
    image: cert05,
  },
  {
    id: 6,
    title: 'Power BI Bootcamp',
    organization: 'LetsUpgrade',
    shortOrg: 'LETSUPGRADE',
    date: '28 May 2025 – 29 May 2025',
    takeaway:
      'Developed foundational knowledge of Power BI dashboards and data visualization.',
    category: 'Data Analytics & Power BI',
    skillsValidated: ['Power BI', 'Data visualization'],
    year: 2025,
    image: cert06,
  },
  {
    id: 7,
    title: 'AI Dashboards using Microsoft Power BI',
    organization: 'Skill Nation',
    shortOrg: 'SKILL NATION',
    date: null,
    takeaway:
      'Practiced building analytics dashboards and visual data stories using Microsoft Power BI.',
    category: 'Data Analytics & Power BI',
    skillsValidated: ['Power BI', 'Analytics dashboards'],
    year: null,
    image: cert07,
  },
  {
    id: 8,
    title: 'Artificial Intelligence Internship',
    organization: 'NoviTech',
    shortOrg: 'NOVITECH',
    date: '28 Jul 2025 – 28 Aug 2025',
    takeaway:
      'Gained structured exposure to artificial intelligence concepts and applied AI workflows.',
    category: 'AI & Machine Learning',
    skillsValidated: ['Artificial intelligence', 'AI workflows'],
    year: 2025,
    image: cert08,
  },
  {
    id: 9,
    title: 'Machine Learning Internship',
    organization: 'NoviTech',
    shortOrg: 'NOVITECH',
    date: '28 Jul 2025 – 28 Aug 2025',
    takeaway:
      'Strengthened understanding of machine learning fundamentals and model-based problem solving.',
    category: 'AI & Machine Learning',
    skillsValidated: ['Machine learning', 'Model-based problem solving'],
    year: 2025,
    image: cert09,
  },
  {
    id: 10,
    title: '30 Days MasterClass in Data Analytics',
    organization: 'NoviTech',
    shortOrg: 'NOVITECH',
    date: '28 Jul 2025 – 01 Sep 2025',
    takeaway:
      'Built practical understanding of data analysis workflows and analytical problem solving.',
    category: 'Data Analytics & Power BI',
    skillsValidated: ['Data analytics', 'Analytical problem solving'],
    year: 2025,
    image: cert10,
  },
  {
    id: 11,
    title: 'Software Testing Workshop',
    organization: 'LeadPro Infotech',
    shortOrg: 'LEADPRO INFOTECH',
    date: '09 Nov 2024',
    takeaway:
      'Learned core software testing principles and structured quality-assurance practices.',
    category: 'Software & Web',
    skillsValidated: ['Software testing', 'Quality assurance'],
    year: 2024,
    image: cert11,
  },
  {
    id: 12,
    title: 'GenAI Powered Data Analytics Job Simulation',
    organization: 'Tata / Forage',
    shortOrg: 'TATA / FORAGE',
    date: '08 Sep 2025',
    takeaway:
      'Applied generative AI concepts to data analytics tasks in a simulated business project.',
    category: 'AI & Machine Learning',
    skillsValidated: ['Generative AI', 'Data analytics'],
    year: 2025,
    image: cert12,
  },
  {
    id: 13,
    title: 'Basics of Python',
    organization: 'Infosys Springboard',
    shortOrg: 'INFOSYS SPRINGBOARD',
    date: '28 Apr 2026',
    takeaway:
      'Established foundational Python programming skills for data and automation tasks.',
    category: 'Software & Web',
    skillsValidated: ['Python'],
    year: 2026,
    image: cert13,
  },
  {
    id: 14,
    title: 'Master GitHub Like a Pro',
    organization: 'NoviTech',
    shortOrg: 'NOVITECH',
    date: '29 Jun 2025',
    takeaway:
      'Learned practical Git and GitHub workflows for version control and project collaboration.',
    category: 'Software & Web',
    skillsValidated: ['Git', 'GitHub', 'Version control'],
    year: 2025,
    image: cert14,
  },
]
