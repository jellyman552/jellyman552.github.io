import { Neofetch } from '../components/Neofetch'
import { ProjectCard } from '../components/ProjectCard'
import { StatusPanel } from '../components/StatusPanel'
import { LinkButton, Prompt, Section } from '../components/ui'
import { education, experience, profile } from '../data/profile'
import { projects } from '../data/projects'

const stats = [
  [String(projects.length), 'projects'],
  [String(projects.reduce((n, p) => n + (p.tests ?? 0), 0)), 'automated tests'],
  [String(projects.filter((p) => p.demo).length || projects.filter((p) => !p.demoNote).length), projects.some((p) => p.demo) ? 'live demos' : 'demos on the way'],
]

export function Home({ onPalette }: { onPalette: () => void }) {
  return (
    <>
      <section className="grid items-center gap-10 pt-14 pb-10 sm:pt-24 sm:pb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8" aria-label="Introduction">
        <div>
          <Prompt cmd="whoami" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-accent glow sm:text-6xl lg:text-5xl">
            {profile.name}
            <span className="cursor ml-2" aria-hidden />
          </h1>
          <p className="mt-3 text-lg text-accent-strong sm:text-xl">
            {profile.role} <span className="text-faint">·</span> {profile.location}
          </p>
          <p className="mt-6 max-w-xl leading-relaxed text-text">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/#projects" primary>
              ls ./projects
            </LinkButton>
            <LinkButton href={profile.github}>github ↗</LinkButton>
            <LinkButton href={profile.linkedin}>linkedin ↗</LinkButton>
          </div>
          <p className="mt-5 hidden text-xs text-faint sm:block">
            tip: press{' '}
            <button type="button" onClick={onPalette} className="rounded border border-line px-1.5 py-0.5 text-muted hover:border-accent hover:text-accent">
              ⌘K
            </button>{' '}
            to jump anywhere
          </p>
        </div>
        <Neofetch />
      </section>

      <ul aria-label="At a glance" className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {stats.map(([n, label]) => (
          <li key={label} className="bg-surface px-4 py-3">
            <span className="block text-2xl font-bold text-accent">{n}</span>
            <span className="text-xs text-muted">{label}</span>
          </li>
        ))}
      </ul>

      <Section id="projects" cmd="ls -l ~/projects" title="Projects">
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} />
          ))}
        </div>
      </Section>

      <Section id="status" cmd="uptime" title="Running right now">
        <StatusPanel />
      </Section>

      <Section id="about" cmd="cat about.md" title="About">
        <div className="max-w-3xl space-y-4 leading-relaxed text-text">
          {profile.about.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </Section>

      <Section id="experience" cmd="tail -n 20 experience.log" title="Experience">
        <ol className="space-y-8 border-l border-line pl-5 sm:pl-8">
          {experience.map((j) => (
            <li key={j.org} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-[1.6rem] h-2.5 w-2.5 rounded-full bg-accent sm:-left-[2.35rem]" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-bold text-text">
                  {j.org} <span className="font-normal text-muted">· {j.role}</span>
                </h3>
                <span className="text-xs text-faint">{j.when}</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
                {j.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span aria-hidden className="text-accent">›</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 mb-3 text-sm text-faint"># education</h3>
        <ul className="space-y-1 text-sm">
          {education.map((e) => (
            <li key={e.what} className="flex flex-wrap gap-x-3">
              <span className="text-text">{e.what}</span>
              <span className="text-muted">{e.where}</span>
              <span className="text-faint">{e.when}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contact" cmd="./contact.sh" title="Contact">
        <p className="max-w-2xl leading-relaxed text-text">
          Open to full-stack roles and freelance builds. The fastest way to reach me is email.
        </p>
        <dl className="mt-6 grid max-w-xl grid-cols-[6rem_1fr] gap-y-2 text-sm">
          <dt className="text-faint">email</dt>
          <dd>
            <a className="break-all text-accent hover:underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </dd>
          <dt className="text-faint">linkedin</dt>
          <dd>
            <a className="text-accent hover:underline" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              in/jagger-nelson
            </a>
          </dd>
          <dt className="text-faint">github</dt>
          <dd>
            <a className="text-accent hover:underline" href={profile.github} target="_blank" rel="noopener noreferrer">
              jellyman552
            </a>
          </dd>
          <dt className="text-faint">résumé</dt>
          <dd>
            <a className="text-accent hover:underline" href={profile.resume} download>
              Jagger_Nelson_Resume.pdf
            </a>
          </dd>
        </dl>
      </Section>
    </>
  )
}
