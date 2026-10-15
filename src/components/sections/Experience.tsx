import { motion, useScroll, useTransform } from 'framer-motion'
import { BriefcaseBusiness, CalendarDays, Sparkles } from 'lucide-react'
import { useRef } from 'react'

import { experiences } from '../../data/experience'
import { slideIn, staggerChildren } from '../../lib/motion'
import { SectionHeading } from '../shared/SectionHeading'

import './Experience.css'

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)

  // Scroll-driven growth of the timeline line.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 85%', 'end 60%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="section-shell experience-section">
      <div className="container">
        <SectionHeading
          index="03"
          kicker="Experience"
          title={
            <>
              Learning through{' '}
              <span className="accent">practical exposure.</span>
            </>
          }
          description="Internships and training programs grouped by organization. Roles, dates and topics are listed as documented on the corresponding certificates."
        />

        <div className="experience-timeline" ref={timelineRef}>
          <div className="exp-track" aria-hidden="true">
            <motion.div
              className="exp-progress"
              style={{ scaleY: lineScale }}
            />
          </div>

          <motion.ul
            className="exp-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerChildren(0.14, 0.05)}
          >
            {experiences.map((group, index) => (
              <motion.li
                key={group.id}
                className="exp-item"
                variants={slideIn}
              >
                <span className="exp-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <article className="exp-card glass-panel">
                  <header className="exp-card-head">
                    <span className="exp-company">
                      <BriefcaseBusiness size={15} aria-hidden="true" />
                      {group.company}
                    </span>
                    <span className="exp-count">
                      {group.roles.length}{' '}
                      {group.roles.length === 1 ? 'program' : 'programs'}
                    </span>
                  </header>

                  <div className="exp-roles">
                    {group.roles.map((role) => (
                      <div key={role.role} className="exp-role">
                        <div className="exp-role-top">
                          <h3>{role.role}</h3>
                          <time className="exp-period">
                            <CalendarDays size={13} aria-hidden="true" />
                            {role.period}
                          </time>
                        </div>

                        {role.topics ? (
                          <div className="exp-topics">
                            <span className="exp-topics-label">
                              <Sparkles size={12} aria-hidden="true" />
                              Key tasks
                            </span>
                            <ul>
                              {role.topics.map((topic) => (
                                <li key={topic}>{topic}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
