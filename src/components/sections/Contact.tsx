import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import type { ComponentType } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { profile } from '../../data/profile'
import { GithubIcon, LinkedinIcon } from '../shared/BrandIcons'
import { Magnetic } from '../shared/Magnetic'
import { Reveal } from '../shared/Reveal'
import { SectionHeading } from '../shared/SectionHeading'

import './Contact.css'

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z
    .string()
    .min(10, 'Message should be at least 10 characters long.'),
})

type FormValues = z.infer<typeof formSchema>

type ChannelIcon = ComponentType<{ size?: number }>

interface ContactChannel {
  label: string
  value: string
  href: string
  icon: ChannelIcon
  external: boolean
}

const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ragulg07',
    href: profile.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/RAGULG19',
    href: profile.github,
    icon: GithubIcon,
    external: true,
  },
]

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (_data: FormValues) => {
    // No backend is configured — we never claim the message was sent.
    reset()
  }

  return (
    <section id="contact" className="section-shell contact-section">
      <div className="container">
        <SectionHeading
          index="08"
          kicker="Contact"
          title={
            <>
              LET&apos;S BUILD
              <br />
              SOMETHING <span className="accent">INTELLIGENT.</span>
            </>
          }
          description="Open to Internship & Entry-Level Opportunities"
        />

        <div className="contact-grid">
          {/* ---------- Channels ---------- */}
          <div className="contact-channels">
            <Reveal>
              <p className="contact-lead">
                Interested in AI, Data Science, Machine Learning, Generative AI
                or data-driven opportunities? Reach out directly — I read every
                message.
              </p>
            </Reveal>

            <ul className="contact-list">
              {contactChannels.map((channel, index) => {
                const Icon = channel.icon

                return (
                  <Reveal as="li" key={channel.label} delay={0.07 * index}>
                    <Magnetic className="magnetic-block" strength={8}>
                    <a
                      className="contact-card"
                      href={channel.href}
                      target={channel.external ? '_blank' : undefined}
                      rel="noreferrer"
                    >
                      <span className="contact-card-icon" aria-hidden="true">
                        <Icon size={18} />
                      </span>

                      <span className="contact-card-text">
                        <small>{channel.label}</small>
                        <strong>{channel.value}</strong>
                      </span>

                      <ArrowUpRight
                        size={17}
                        className="contact-card-arrow"
                        aria-hidden="true"
                      />
                    </a>
                    </Magnetic>
                  </Reveal>
                )
              })}
            </ul>

            <Reveal delay={0.1}>
              <div className="contact-badges">
                <span className="badge">
                  <span className="badge-dot" aria-hidden="true" />
                  Open to Internship &amp; Entry-Level Opportunities
                </span>
              </div>
            </Reveal>
          </div>

          {/* ---------- Form ---------- */}
          <Reveal delay={0.12}>
            <form
              className="contact-form glass-panel"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Contact form"
            >
              <div className="contact-form-head">
                <span>Send a message</span>
                <span>08 / 08</span>
              </div>

              <label className="form-field">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  {...register('name')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name ? (
                  <small id="name-error" role="alert">
                    {errors.name.message}
                  </small>
                ) : null}
              </label>

              <label className="form-field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email ? (
                  <small id="email-error" role="alert">
                    {errors.email.message}
                  </small>
                ) : null}
              </label>

              <label className="form-field">
                <span>Message</span>
                <textarea
                  rows={5}
                  placeholder="Tell me about the opportunity..."
                  {...register('message')}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? 'message-error' : undefined
                  }
                />
                {errors.message ? (
                  <small id="message-error" role="alert">
                    {errors.message.message}
                  </small>
                ) : null}
              </label>

              <Magnetic strength={7}>
                <button type="submit" className="btn btn-primary form-submit">
                  Validate Message
                  <ArrowRight
                    size={16}
                    className="btn-arrow"
                    aria-hidden="true"
                  />
                </button>
              </Magnetic>

              {isSubmitSuccessful ? (
                <div className="form-notice" role="status">
                  <strong>Message validated locally.</strong>
                  <p>
                    This portfolio has no backend connected, so your message
                    was <em>not</em> emailed. Please send it directly to{' '}
                    <a href={`mailto:${profile.email}`}>{profile.email}</a> and
                    I&apos;ll get back to you.
                  </p>
                </div>
              ) : (
                <p className="form-footnote">
                  Demo form — inputs are validated in your browser; nothing is
                  sent to a server. Prefer email?{' '}
                  <a href={`mailto:${profile.email}`}>
                    {profile.email}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
