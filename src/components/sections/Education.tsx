import { motion, useScroll, useTransform } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { useRef } from 'react'

import { profile } from '../../data/profile'
import { Reveal } from '../shared/Reveal'
import { SectionHeading } from '../shared/SectionHeading'

import './Education.css'

export function Education() {
  const timelineRef = useRef<HTMLDivElement>(null)

  // Scroll-driven growth of the timeline line.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 85%', 'end 55%'],
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="education" className="section-shell education-section">
      <div className="container">
        <SectionHeading
          index="02"
          kicker="Education"
          title={
            <>
              The foundation behind{' '}
              <span className="accent">the journey.</span>
            </>
          }
        />

        <div className="education-timeline" ref={timelineRef}>
          <div className="timeline-track" aria-hidden="true">
            <motion.div className="timeline-progress" style={{ scaleY: lineScale }} />
          </div>

          <div className="education-item">
            <motion.div
              className="timeline-marker"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              <span className="timeline-marker-ring" />
              <GraduationCap size={20} />
            </motion.div>

            <Reveal>
              <article className="education-card glass-panel">
                <div className="education-card-head">
                  <div>
                    <span className="education-eyebrow">
                      B.Tech / {profile.graduation}
                    </span>
                    <h3>{profile.degree}</h3>
                    <p className="education-institution">
                      {profile.institution}
                    </p>
                  </div>

                  <div className="education-cgpa" aria-label={`CGPA ${profile.cgpa}`}>
                    <span>CGPA</span>
                    <strong>{profile.cgpa}</strong>
                  </div>
                </div>

                <dl className="education-meta">
                  <div>
                    <dt>Expected Graduation</dt>
                    <dd>{profile.graduation}</dd>
                  </div>
                  <div>
                    <dt>Specialization</dt>
                    <dd>AI &amp; Data Science</dd>
                  </div>
                  <div>
                    <dt>Focus</dt>
                    <dd>AI • ML • Data</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
