import { motion } from 'framer-motion'
import { Crosshair } from 'lucide-react'

import { recruiterRoles } from '../../data/roleFocus'
import type { RecruiterRole } from '../../data/roleFocus'

import './RoleFilterMatrix.css'

interface RoleFilterMatrixProps {
  role: RecruiterRole
  onChange: (role: RecruiterRole) => void
}

export function RoleFilterMatrix({ role, onChange }: RoleFilterMatrixProps) {
  return (
    <motion.section
      className="role-filter-matrix container"
      aria-label="Recruiter role filter"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="role-filter-heading"><Crosshair size={16} aria-hidden="true" /><span>Targeting Role:</span><strong>{recruiterRoles.find((item) => item.id === role)?.label}</strong></div>
      <div className="role-filter-options" role="group" aria-label="Choose a recruiter focus">
        {recruiterRoles.map((item) => (
          <button key={item.id} type="button" aria-pressed={role === item.id} className={role === item.id ? 'is-active' : ''} onClick={() => onChange(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <p>{role === 'all' ? 'Select a role to bring the most relevant skills, certificates and project features forward.' : 'Portfolio highlights now emphasize this role.'}</p>
    </motion.section>
  )
}
