import { motion } from 'framer-motion'
import {
  Bell,
  Bot,
  ExternalLink,
  GitBranch,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from 'lucide-react'

import { marketTracker, parentConnect } from '../../data/projects'
import type { RecruiterRole } from '../../data/roleFocus'
import { isRoleRelevant } from '../../data/roleFocus'
import { fadeUp, staggerChildren } from '../../lib/motion'
import { ArchitectureFlow } from '../projects/ArchitectureFlow'
import { ForecastChartLoader } from './ForecastChartLoader'
import { Magnetic } from '../shared/Magnetic'
import { SectionHeading } from '../shared/SectionHeading'

import './ProjectShowcase.css'

interface ProjectShowcaseProps {
  onAskAI: () => void
  role: RecruiterRole
}

export function ProjectShowcase({ onAskAI, role }: ProjectShowcaseProps) {
  return (
    <section
      id="projects"
      className="section-shell project-section"
    >
      <div className="container">
        <SectionHeading
          index="05"
          kicker="Featured Project"
          title={
            <>
              MARKET <span className="accent">AI TRACKER</span>
            </>
          }
          description={marketTracker.description}
        />

        <motion.div
          className="project-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren(0.09, 0.05)}
        >
          {/* ---------- Info column ---------- */}
          <motion.div className="project-info" variants={fadeUp}>
            <span className="project-label">
              <Zap size={13} aria-hidden="true" />
              PROJECT / {marketTracker.index}
            </span>

            <h3 className="project-title">{marketTracker.title}</h3>
            <p className="project-subtitle">{marketTracker.subtitle}</p>

            <div className="project-tech" aria-label="Technology stack">
              {marketTracker.tech.map((tech) => {
                const relevant = isRoleRelevant(role, [tech])
                return <motion.span key={tech} className={role !== 'all' && !relevant ? 'is-role-dimmed' : role !== 'all' ? 'is-role-highlighted' : ''} animate={{ opacity: role !== 'all' && !relevant ? 0.38 : 1, y: role !== 'all' && relevant ? -2 : 0 }} transition={{ duration: 0.25 }}>{tech}</motion.span>
              })}
            </div>

            <div className="project-features">
              <h4>Core features</h4>
              <ul>
                {marketTracker.features.map((feature) => {
                  const relevant = isRoleRelevant(role, [feature])
                  return <motion.li key={feature} className={role !== 'all' && relevant ? 'is-role-highlighted' : ''} animate={{ opacity: role !== 'all' && !relevant ? 0.36 : 1, y: role !== 'all' && relevant ? -1 : 0, scale: role !== 'all' && relevant ? 1.01 : 1 }} transition={{ duration: 0.25 }}>
                    <span className="feature-tick" aria-hidden="true" />
                    {feature}
                  </motion.li>
                })}
              </ul>
            </div>

            <p className="project-disclaimer">{marketTracker.disclaimer}</p>

            <div className="project-actions">
              <Magnetic strength={8}>
                <a
                  className="btn btn-primary"
                  href={marketTracker.links.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                  <ExternalLink size={15} className="btn-icon" aria-hidden="true" />
                </a>
              </Magnetic>

              <Magnetic strength={8}>
                <a
                  className="btn btn-secondary"
                  href={marketTracker.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitBranch size={15} className="btn-icon" aria-hidden="true" />
                  GitHub
                </a>
              </Magnetic>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={onAskAI}
              >
                <Sparkles size={15} className="btn-icon" aria-hidden="true" />
                Ask AI about this project
              </button>
            </div>

            <a
              className="project-backend-link"
              href={marketTracker.links.backend}
              target="_blank"
              rel="noreferrer"
            >
              Flask API backend ↗
            </a>
          </motion.div>

          {/* ---------- Dashboard preview ---------- */}
          <motion.div
            className="project-visual"
            variants={{
              hidden: { opacity: 0, y: 48, rotateX: 10, filter: 'blur(12px)' },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <div className="dashboard-window">
              <div className="dashboard-chrome">
                <span className="chrome-dot chrome-red" />
                <span className="chrome-dot chrome-amber" />
                <span className="chrome-dot chrome-blue" />
                <span className="dashboard-chrome-title">
                  market-ai-tracker.vercel.app
                </span>
                <span className="dashboard-live">
                  <i aria-hidden="true" />
                  DEMO
                </span>
              </div>

              <div className="dashboard-body">
                <div className="dashboard-head">
                  <div>
                    <small>TCS.NS · illustrative preview</small>
                    <strong>CANDLESTICK + SMA OVERLAYS</strong>
                  </div>

                  <div className="dashboard-signal">
                    <span className="signal-value">BUY</span>
                    <span className="signal-label">Signal + Alert</span>
                  </div>
                </div>

                <ForecastChartLoader />

                <div className="dashboard-chart">
                  <svg
                    viewBox="0 0 540 240"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Illustrative candlestick chart with SMA20, SMA50 overlays and a dashed forecast line"
                  >
                    <defs>
                      <linearGradient
                        id="matCandleUp"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#45e0ff" />
                        <stop
                          offset="100%"
                          stopColor="#45e0ff"
                          stopOpacity="0.55"
                        />
                      </linearGradient>
                    </defs>

                    {/* grid */}
                    {[40, 90, 140, 190].map((y) => (
                      <line
                        key={y}
                        x1="10"
                        y1={y}
                        x2="530"
                        y2={y}
                        className="chart-gridline"
                      />
                    ))}

                    {/* forecast confidence band */}
                    <motion.polygon
                      points={marketTracker.forecastBand}
                      className="chart-band"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.15, duration: 0.8 }}
                    />

                    {/* candles */}
                    {marketTracker.candles.map((candle, index) => {
                      const bullish = candle.close < candle.open
                      const bodyTop = Math.min(candle.open, candle.close)
                      const bodyHeight =
                        Math.abs(candle.open - candle.close) || 2

                      return (
                        <motion.g
                          key={candle.x}
                          className={`chart-candle ${bullish ? 'is-up' : 'is-down'}`}
                          initial={{ opacity: 0, scaleY: 0.2 }}
                          whileInView={{ opacity: 1, scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.55 + index * 0.045,
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{ transformOrigin: `${candle.x}px 120px` }}
                        >
                          <line
                            x1={candle.x}
                            y1={candle.high}
                            x2={candle.x}
                            y2={candle.low}
                            className="candle-wick"
                          />
                          <rect
                            x={candle.x - 6}
                            y={bodyTop}
                            width="12"
                            height={bodyHeight}
                            rx="2"
                            className="candle-body"
                          />
                        </motion.g>
                      )
                    })}

                    {/* SMA overlays */}
                    <motion.polyline
                      points={marketTracker.sma50Points}
                      className="chart-sma chart-sma-50"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9, duration: 1.4, ease: 'easeInOut' }}
                    />
                    <motion.polyline
                      points={marketTracker.sma20Points}
                      className="chart-sma chart-sma-20"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 1.4, ease: 'easeInOut' }}
                    />

                    {/* 14-day forecast */}
                    <motion.polyline
                      points={marketTracker.forecastPoints}
                      className="chart-forecast"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.4, duration: 0.9, ease: 'easeOut' }}
                    />
                  </svg>

                  <div className="chart-legend" aria-hidden="true">
                    <span className="legend-item legend-sma20">SMA 20</span>
                    <span className="legend-item legend-sma50">SMA 50</span>
                    <span className="legend-item legend-forecast">
                      14D Forecast
                    </span>
                  </div>
                </div>

                <dl className="dashboard-stats">
                  {marketTracker.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt>{stat.label}</dt>
                      <dd>{stat.value}</dd>
                      <small>{stat.hint}</small>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="project-visual-glow" aria-hidden="true" />
          </motion.div>
        </motion.div>
        <ArchitectureFlow />

        <motion.article
          className="project-card parentconnect-project-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren(0.08, 0.04)}
        >
          <motion.div className="project-info" variants={fadeUp}>
            <span className="project-label">
              <Zap size={13} aria-hidden="true" />
              PROJECT / {parentConnect.index}
            </span>

            <h3 className="project-title">{parentConnect.title}</h3>
            <p className="project-subtitle">{parentConnect.category}</p>
            <p className="project-subtitle parentconnect-status"><small>{parentConnect.status}</small></p>
            <p className="parentconnect-description">{parentConnect.description}</p>

            <div className="project-tech" aria-label="Technology stack">
              {parentConnect.tech.map((tech) => {
                const relevant = isRoleRelevant(role, [tech])
                const roleClass = role === 'all'
                  ? ''
                  : relevant
                    ? 'is-role-highlighted'
                    : 'is-role-dimmed'

                return (
                  <motion.span
                    key={tech}
                    className={roleClass}
                    animate={{
                      opacity: role !== 'all' && !relevant ? 0.38 : 1,
                      y: role !== 'all' && relevant ? -2 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {tech}
                  </motion.span>
                )
              })}
            </div>

            <div className="project-features">
              <h4>Core features</h4>
              <ul>
                {parentConnect.features.map((feature) => {
                  const relevant = isRoleRelevant(role, [feature])

                  return (
                    <motion.li
                      key={feature}
                      className={role !== 'all' && relevant ? 'is-role-highlighted' : ''}
                      animate={{
                        opacity: role !== 'all' && !relevant ? 0.36 : 1,
                        y: role !== 'all' && relevant ? -1 : 0,
                        scale: role !== 'all' && relevant ? 1.01 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="feature-tick" aria-hidden="true" />
                      {feature}
                    </motion.li>
                  )
                })}
              </ul>
            </div>

            <div className="project-actions">
              {parentConnect.links.demo ? (
                <Magnetic strength={8}>
                  <a
                    className="btn btn-primary"
                    href={parentConnect.links.demo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live Demo
                    <ExternalLink size={15} className="btn-icon" aria-hidden="true" />
                  </a>
                </Magnetic>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary project-link-pending"
                  disabled
                  title="Add the ParentConnect AI demo URL in src/data/projects.ts"
                >
                  Live Demo · Coming soon
                </button>
              )}

              {parentConnect.links.github ? (
                <Magnetic strength={8}>
                  <a
                    className="btn btn-secondary"
                    href={parentConnect.links.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch size={15} className="btn-icon" aria-hidden="true" />
                    GitHub
                  </a>
                </Magnetic>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary project-link-pending"
                  disabled
                  title="Add the ParentConnect AI GitHub URL in src/data/projects.ts"
                >
                  <GitBranch size={15} className="btn-icon" aria-hidden="true" />
                  GitHub · Coming soon
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            className="project-visual parentconnect-visual"
            variants={{
              hidden: { opacity: 0, y: 42, rotateX: 8, filter: 'blur(10px)' },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <div className="parentconnect-preview" aria-hidden="true">
              <div className="parentconnect-preview-header">
                <span className="parentconnect-preview-mark">
                  <Sparkles size={17} aria-hidden="true" />
                </span>
                <span className="parentconnect-preview-brand">
                  <strong>ParentConnect AI</strong>
                  <small>FAMILY &amp; SCHOOL PORTAL</small>
                </span>
                <span className="parentconnect-preview-status">
                  <i aria-hidden="true" />
                  CONNECTED
                </span>
              </div>

              <div className="parentconnect-preview-body">
                <nav className="parentconnect-preview-nav" aria-label="Dashboard preview">
                  <span className="is-active"><LayoutDashboard size={15} /> Overview</span>
                  <span><UsersRound size={15} /> Students</span>
                  <span><Bell size={15} /> Updates</span>
                </nav>

                <div className="parentconnect-preview-content">
                  <span className="parentconnect-preview-kicker">PARENT DASHBOARD</span>
                  <h4>School, in sync.</h4>
                  <p>Questions, student details, and school updates together.</p>

                  <div className="parentconnect-preview-tiles">
                    <div className="parentconnect-preview-tile">
                      <span className="parentconnect-tile-icon is-cyan"><Bot size={16} /></span>
                      <small>AI ASSISTANT</small>
                      <strong>School query support</strong>
                    </div>
                    <div className="parentconnect-preview-tile">
                      <span className="parentconnect-tile-icon is-violet"><MessageCircle size={16} /></span>
                      <small>SMART NOTIFICATIONS</small>
                      <strong>Automated parent updates</strong>
                    </div>
                  </div>

                  <div className="parentconnect-preview-auth">
                    <ShieldCheck size={15} aria-hidden="true" />
                    Role-based views (planned) · Auth in development
                  </div>
                </div>
              </div>
              <span className="parentconnect-preview-caption">ILLUSTRATIVE PRODUCT PREVIEW</span>
            </div>
            <div className="project-visual-glow" aria-hidden="true" />
          </motion.div>
        </motion.article>
      </div>
    </section>
  )
}
