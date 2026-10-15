import {
  BrainCircuit,
  Database,
  WandSparkles,
  MonitorSmartphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { profile } from '../../data/profile'
import { Reveal } from '../shared/Reveal'
import { SectionHeading } from '../shared/SectionHeading'
import { TiltCard } from '../shared/TiltCard'

import './About.css'

interface Capability {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const capabilities: Capability[] = [
  {
    number: '01',
    title: 'AI & Machine Learning',
    description:
      'Building predictive models and intelligent systems with Python and modern ML workflows.',
    icon: BrainCircuit,
  },
  {
    number: '02',
    title: 'Data & Analytics',
    description:
      'Exploratory analysis, dashboards and insight generation with Pandas, NumPy and Power BI.',
    icon: Database,
  },
  {
    number: '03',
    title: 'Generative AI',
    description:
      'Exploring LLM concepts, modern AI tools and practical generative AI applications.',
    icon: WandSparkles,
  },
  {
    number: '04',
    title: 'UI/UX & Web',
    description:
      'Designing and shipping interfaces with React, Flask and thoughtful UI/UX principles.',
    icon: MonitorSmartphone,
  },
]

const facts = [
  { label: 'Degree', value: 'B.Tech AI & Data Science' },
  { label: 'Institution', value: 'RVS Institute of Technology' },
  { label: 'CGPA', value: profile.cgpa },
  { label: 'Expected Graduation', value: profile.graduation },
]

export function About() {
  return (
    <section id="about" className="section-shell about-section">
      <div className="container">
        <SectionHeading index="01" kicker="Who I Am" title="WHO I AM" editorial />

        <div className="about-intro">
          <Reveal>
            <p className="about-lead">
              I&apos;m <strong>Ragul G</strong>, a final-year Artificial
              Intelligence and Data Science student interested in building
              practical solutions with machine learning, data analytics, and
              <span className="text-gradient"> Generative AI.</span>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="about-body">
              <p>
                I work with Python and SQL for programming and data analysis,
                explore machine learning workflows, and use Power BI to turn
                data into meaningful insights. I also have hands-on exposure to
                React and Flask for developing interactive applications.
              </p>
              <p>
                My goal is to combine analytical thinking, AI technologies, and
                problem-solving to build useful, data-driven applications.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <dl className="about-facts">
            {facts.map((fact) => (
              <div key={fact.label} className="about-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="about-capabilities">
          {capabilities.map((item, index) => {
            const Icon = item.icon

            return (
              <Reveal key={item.number} delay={0.06 * index}>
                <TiltCard className="capability-card" maxTilt={8}>
                  <div className="capability-glow" aria-hidden="true" />
                  <div className="capability-top">
                    <span className="capability-number">{item.number}</span>
                    <span className="capability-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <span className="capability-line" aria-hidden="true" />
                </TiltCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="about-signature" aria-label="Code, data, intelligence">
            <span>CODE</span>
            <span className="about-signature-arrow" aria-hidden="true">
              →
            </span>
            <span>DATA</span>
            <span className="about-signature-arrow" aria-hidden="true">
              →
            </span>
            <span className="text-gradient">INTELLIGENCE</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
