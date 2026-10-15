import { useState } from 'react'
import { motion } from 'framer-motion'

import { skillGroups, skills } from '../../data/skills'
import type { Skill } from '../../data/skills'
import type { RecruiterRole } from '../../data/roleFocus'
import { isRoleRelevant } from '../../data/roleFocus'
import { Reveal } from '../shared/Reveal'
import { SectionHeading } from '../shared/SectionHeading'

import './Skills.css'

const relatedContent: Record<string, { projects: string[]; certificates: string[] }> = {
  Python: { projects: ['Market AI Tracker'], certificates: ['Basics of Python', 'Artificial Intelligence Internship'] },
  SQL: { projects: ['Market AI Tracker'], certificates: ['Data Analytics Job Simulation'] },
  'Machine Learning': { projects: ['Market AI Tracker'], certificates: ['Machine Learning Internship', 'Data Science Internship'] },
  'Generative AI': { projects: [], certificates: ['Generative AI Workshop', 'GenAI Powered Data Analytics Job Simulation'] },
  'Linear Regression': { projects: ['Market AI Tracker'], certificates: ['Machine Learning Internship'] },
  'scikit-learn': { projects: ['Market AI Tracker'], certificates: ['Machine Learning Internship'] },
  'Power BI': { projects: [], certificates: ['Power BI Bootcamp', 'AI Dashboards using Microsoft Power BI'] },
  Pandas: { projects: ['Market AI Tracker'], certificates: ['Data Science Internship', '30 Days MasterClass in Data Analytics'] },
  NumPy: { projects: ['Market AI Tracker'], certificates: ['Data Science Internship'] },
  'Data Pipelines': { projects: ['Market AI Tracker'], certificates: ['Data Science Internship'] },
  'React.js': { projects: ['Market AI Tracker'], certificates: ['UI/UX Design Training'] },
  Flask: { projects: ['Market AI Tracker'], certificates: ['Basics of Python'] },
  'HTML/CSS': { projects: [], certificates: ['UI/UX Design Training', 'UI/UX Design Internship'] },
  JavaScript: { projects: ['Market AI Tracker'], certificates: ['UI/UX Design Training'] },
  'REST APIs': { projects: ['Market AI Tracker'], certificates: ['Basics of Python'] },
  Git: { projects: ['Market AI Tracker'], certificates: ['Master GitHub Like a Pro'] },
  GitHub: { projects: ['Market AI Tracker'], certificates: ['Master GitHub Like a Pro'] },
  'VS Code': { projects: ['Market AI Tracker'], certificates: ['Master GitHub Like a Pro'] },
  Postman: { projects: ['Market AI Tracker'], certificates: ['Software Testing Workshop'] },
}

interface SkillsProps { role: RecruiterRole }

export function Skills({ role }: SkillsProps) {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
  const activeLinks = activeSkill ? relatedContent[activeSkill.name] : undefined

  return (
    <section id="skills" className="section-shell skills-section">
      <div className="container">
        <SectionHeading
          index="04"
          kicker="Technical Skills"
          title={<>A practical <span className="accent">skills matrix.</span></>}
          description="Explore the tools and methods I use across AI, analytics, web applications and software development. Select a skill to see related portfolio work."
        />
        <div className="skills-matrix">
          {skillGroups.map((group) => {
            const Icon = group.icon
            const groupSkills = skills.filter((skill) => skill.group === group.id)
            const groupRelevant = groupSkills.some((skill) => isRoleRelevant(role, [skill.name]))
            return (
              <motion.article key={group.id} className={`skill-domain-card accent-${group.accent}${role !== 'all' && groupRelevant ? ' is-role-relevant' : role !== 'all' ? ' is-role-dimmed' : ''}`} animate={{ opacity: role !== 'all' && !groupRelevant ? 0.48 : 1, y: role !== 'all' && groupRelevant ? -2 : 0 }} transition={{ duration: 0.3 }}>
                <header><span className="skill-domain-icon"><Icon size={18} aria-hidden="true" /></span><h3>{group.title}</h3><span className="skill-domain-count">{String(groupSkills.length).padStart(2, '0')}</span></header>
                <div className="skill-badges">
                  {groupSkills.map((skill) => (
                    <motion.button
                      key={skill.name}
                      type="button"
                      className={`skill-badge${activeSkill?.name === skill.name ? ' is-active' : ''}${role !== 'all' && isRoleRelevant(role, [skill.name]) ? ' is-role-relevant' : role !== 'all' ? ' is-role-dimmed' : ''}`}
                      animate={{ opacity: role !== 'all' && !isRoleRelevant(role, [skill.name]) ? 0.34 : 1, scale: role !== 'all' && isRoleRelevant(role, [skill.name]) ? 1.04 : 1 }}
                      transition={{ duration: 0.22 }}
                      onMouseEnter={() => setActiveSkill(skill)}
                      onMouseLeave={() => setActiveSkill(null)}
                      onFocus={() => setActiveSkill(skill)}
                      onBlur={() => setActiveSkill(null)}
                      aria-describedby="skill-related-content"
                    >{skill.name}</motion.button>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
        <Reveal delay={0.05}>
          <aside id="skill-related-content" className={`skill-related-panel${activeSkill ? ' has-active' : ''}`} aria-live="polite">
            {activeSkill ? <>
              <div><span className="skill-related-kicker">SELECTED SKILL</span><strong>{activeSkill.name}</strong><p>{activeSkill.description}</p></div>
              <div className="skill-related-links">
                <span>RELATED WORK</span>
                {activeLinks?.projects.map((name) => <a key={name} href="#projects">{name}<span aria-hidden="true"> ↗</span></a>)}
                {activeLinks?.certificates.length ? <a href="#certifications">{activeLinks.certificates.length} related certificate{activeLinks.certificates.length === 1 ? '' : 's'}<span aria-hidden="true"> ↗</span></a> : null}
                {!activeLinks?.projects.length && !activeLinks?.certificates.length ? <small>Related portfolio items are being added.</small> : null}
              </div>
            </> : <p>Hover or focus a skill badge to highlight related projects and certifications.</p>}
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
