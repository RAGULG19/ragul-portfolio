import { motion } from 'framer-motion'
import {
  BrainCircuit,
  ChartLine,
  Cpu,
  Database,
  Radar,
  WandSparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { staggerChildren } from '../../lib/motion'
import { SectionHeading } from '../shared/SectionHeading'
import { TiltCard } from '../shared/TiltCard'

import './ProfessionalFocus.css'

interface FocusNode {
  title: string
  icon: LucideIcon
}

/** Ordered arbitrarily — these areas are NOT ranked. */
const focusNodes: FocusNode[] = [
  { title: 'AI & Machine Learning', icon: BrainCircuit },
  { title: 'Data Science', icon: Database },
  { title: 'Data Analytics', icon: ChartLine },
  { title: 'Generative AI', icon: WandSparkles },
  { title: 'Business Intelligence', icon: Radar },
  { title: 'AI-powered Applications', icon: Cpu },
]

export function ProfessionalFocus() {
  return (
    <section id="focus" className="section-shell focus-section">
      <div className="container">
        <SectionHeading
          index="07"
          kicker="Professional Focus"
          title={
            <>
              Where I&apos;m <span className="accent">heading.</span>
            </>
          }
          description="Six areas of equal interest — no hierarchy, just the domains I want to keep building in."
        />

        <motion.div
          className="focus-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerChildren(0.09, 0.05)}
        >
          {focusNodes.map((node, index) => {
            const Icon = node.icon

            return (
              <motion.div
                key={node.title}
                className="focus-node-wrap"
                variants={{
                  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{ y: -8 }}
              >
                <TiltCard
                  className={`focus-node focus-node-${index % 3}`}
                  maxTilt={6}
                >
                  <span className="focus-orb" aria-hidden="true" />

                  <span className="focus-icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>

                  <h3>{node.title}</h3>

                  <span className="focus-link-line" aria-hidden="true" />
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
