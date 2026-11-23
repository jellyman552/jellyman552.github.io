import { ProjectCard } from './components/ProjectCard'
import { LinkButton, Prompt, Section } from './components/ui'
import { education, experience, profile } from './data/profile'
import { projects } from './data/projects'

const nav = [
  { href: '#projects', label: 'projects' },
  { href: '#about', label: 'about' },
  { href: '#experience', label: 'experience' },
  { href: '#contact', label: 'contact' },
]

export default function App() {
  return (
    <>
      <a href="#projects" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-bg">
        Skip to projects
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="text-sm font-bold text-accent">
            ~/{profile.handle}
          </a>
          <nav aria-label="Sections" className="flex items-center gap-3 text-sm sm:gap-5">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hidden text-muted hover:text-accent sm:inline">
                ./{n.label}
              </a>
            ))}
            <a
              href={profile.resume}
              download
              className="rounded border border-accent px-2.5 py-1 text-accent hover:bg-accent hover:text-bg"
            >
              résumé.pdf
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* hero */}
        <section className="pt-16 pb-10 sm:pt-28 sm:pb-16" aria-label="Introduction">
          <Prompt cmd="whoami" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-accent glow sm:text-6xl">
            {profile.name}
            <span className="cursor ml-2" aria-hidden />
          </h1>
          <p className="mt-3 text-lg text-accent-strong sm:text-xl">
            {profile.role} <span className="text-faint">·</span> {profile.location}
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-text">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="#projects" primary>
              ls ./projects
            </LinkButton>
            <LinkButton href={profile.github}>github ↗</LinkButton>
            <LinkButton href={profile.linkedin}>linkedin ↗</LinkButton>
          </div>
        </section>

        <Section id="projects" cmd="ls -l ~/projects" title="Projects">
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} p={p} index={i} />
            ))}
          </div>
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
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-faint sm:px-6">
          <span className="text-accent">$</span> exit · built with React, Vite and Tailwind · © {new Date().getFullYear()} {profile.name}
        </div>
      </footer>
    </>
  )
}
