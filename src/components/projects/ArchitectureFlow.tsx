import { motion } from 'framer-motion'
import { ArrowRight, BrainCircuit, ChartNoAxesCombined, Database, Globe2, Server } from 'lucide-react'
import { useState } from 'react'

import './ArchitectureFlow.css'

const nodes = [
  { id: 'ui', title: 'User Interface', tech: 'React', icon: Globe2 },
  { id: 'api', title: 'API Layer', tech: 'Flask', icon: Server },
  { id: 'data', title: 'Data Fetcher', tech: 'yFinance', icon: Database },
  { id: 'model', title: 'Inference Engine', tech: 'scikit-learn', icon: BrainCircuit },
  { id: 'visuals', title: 'Visuals', tech: 'Chart.js', icon: ChartNoAxesCombined },
] as const

export function ArchitectureFlow() {
  const [activeNode, setActiveNode] = useState<number | null>(null)

  return (
    <section className="architecture-panel" aria-labelledby="architecture-title">
      <div className="architecture-heading">
        <div><span>MARKET AI TRACKER / DATA PATH</span><h3 id="architecture-title">From market data to a clear signal.</h3></div>
        <small>Hover or focus a node to trace the flow</small>
      </div>
      <div className="architecture-scroll" tabIndex={0} aria-label="Scrollable project architecture diagram">
        <div className="architecture-flow-track">
          {nodes.map((node, index) => {
            const Icon = node.icon
            const active = activeNode === index
            return <div className="architecture-flow-step" key={node.id}>
              <motion.button
                type="button"
                className={`architecture-node${index % 2 ? ' is-violet' : ''}${active ? ' is-active' : ''}`}
                onMouseEnter={() => setActiveNode(index)}
                onMouseLeave={() => setActiveNode(null)}
                onFocus={() => setActiveNode(index)}
                onBlur={() => setActiveNode(null)}
                whileHover={{ y: -4, scale: 1.025 }}
                whileFocus={{ y: -3 }}
                aria-label={`${node.title}, ${node.tech}`}
              >
                <span className="architecture-node-icon"><Icon size={19} aria-hidden="true" /></span>
                <strong>{node.title}</strong>
                <small>{node.tech}</small>
                <motion.span className="architecture-node-pulse" animate={active ? { opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.08, 0.9] } : { opacity: 0.18 }} transition={{ duration: 1.35, repeat: active ? Infinity : 0 }} aria-hidden="true" />
              </motion.button>
              {index < nodes.length - 1 ? <div className={`architecture-edge${activeNode === index || activeNode === index + 1 ? ' is-active' : ''}`} aria-hidden="true">
                <ArrowRight className="architecture-edge-arrow" size={16} />
                <motion.span className="architecture-particle" animate={activeNode === index || activeNode === index + 1 ? { x: [0, 30, 0], opacity: [0, 1, 0] } : { opacity: 0 }} transition={{ duration: 1.05, repeat: activeNode === index || activeNode === index + 1 ? Infinity : 0, ease: 'easeInOut' }} />
              </div> : null}
            </div>
          })}
        </div>
      </div>
    </section>
  )
}
