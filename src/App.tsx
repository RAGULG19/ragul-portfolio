import { MotionConfig, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { InteractiveBackground } from './components/background/InteractiveBackground'
import type { AssistantState } from './components/assistant/AskRagulAI'
import { AskRagulAI } from './components/assistant/AskRagulAI'
import { CustomCursor } from './components/cursor/CustomCursor'
import { RoleFilterMatrix } from './components/common/RoleFilterMatrix'
import { SystemMetricsBar } from './components/common/SystemMetricsBar'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/nav/Navbar'
import { About } from './components/sections/About'
import { Certifications } from './components/sections/Certifications'
import { Contact } from './components/sections/Contact'
import { Education } from './components/sections/Education'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { ProfessionalFocus } from './components/sections/ProfessionalFocus'
import { ProjectShowcase } from './components/sections/ProjectShowcase'
import { Skills } from './components/sections/Skills'
import { sectionIds } from './data/navigation'
import type { RecruiterRole } from './data/roleFocus'
import { useActiveSection } from './hooks/useActiveSection'

import './components/shared/shared.css'

function App() {
  const activeSection = useActiveSection(sectionIds)
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedCert, setSelectedCert] = useState<number | null>(null)
  const [recruiterRole, setRecruiterRole] = useState<RecruiterRole>('all')
  const [assistant, setAssistant] = useState<AssistantState>({
    open: false,
    mode: 'general',
  })

  // Navbar glass state + scroll progress.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section-reactive background lighting (visual only).
  useEffect(() => {
    document.body.dataset.section = activeSection
  }, [activeSection])

  const closeCert = useCallback(() => setSelectedCert(null), [])
  const navigateCert = useCallback(
    (index: number) => setSelectedCert(index),
    [],
  )

  const openProjectAssistant = useCallback(() => {
    setAssistant({ open: true, mode: 'project' })
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="portfolio-shell">
        <InteractiveBackground />
        <CustomCursor />

        <Navbar activeSection={activeSection} isScrolled={isScrolled} />

        <motion.main
          id="main-content"
          className="page-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Hero />
          <RoleFilterMatrix role={recruiterRole} onChange={setRecruiterRole} />
          <About />
          <Education />
          <Experience />
          <Skills role={recruiterRole} />
          <ProjectShowcase onAskAI={openProjectAssistant} role={recruiterRole} />
          <Certifications
            selectedIndex={selectedCert}
            onSelect={setSelectedCert}
            onClose={closeCert}
            onNavigate={navigateCert}
            role={recruiterRole}
          />
          <ProfessionalFocus />
          <Contact />
        </motion.main>

        <Footer />

        <SystemMetricsBar />

        <AskRagulAI state={assistant} setState={setAssistant} />
      </div>
    </MotionConfig>
  )
}

export default App
