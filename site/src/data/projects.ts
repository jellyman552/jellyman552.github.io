export type Shot = { src: string; alt: string }
export type Challenge = { title: string; body: string }

export type Project = {
  slug: string
  order: number
  title: string
  tagline: string
  year: string
  stack: string[]
  highlights: string[]
  demo: string | null
  demoNote?: string
  source: string | null
  // case-study page
  role: string
  problem: string
  challenges: Challenge[]
  next?: string[]
  tests?: number
  shots: Shot[]
  transcript?: string
  // loaded from ./diagrams/<slug>.txt and ./transcripts/<name>.txt
  diagram?: string
  transcriptText?: string
}

// One JSON file per project in ./projects; add a file to add a project.
const files = import.meta.glob<Omit<Project, 'diagram' | 'transcriptText'>>('./projects/*.json', {
  eager: true,
  import: 'default',
})
const diagrams = import.meta.glob<string>('./diagrams/*.txt', { eager: true, query: '?raw', import: 'default' })
const transcripts = import.meta.glob<string>('./transcripts/*.txt', { eager: true, query: '?raw', import: 'default' })

export const projects: Project[] = Object.values(files)
  .map((p) => ({
    ...p,
    diagram: diagrams[`./diagrams/${p.slug}.txt`]?.replace(/\n+$/, ''),
    transcriptText: p.transcript ? transcripts[`./transcripts/${p.transcript}.txt`]?.replace(/\n+$/, '') : undefined,
  }))
  .sort((a, b) => a.order - b.order)

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

/** Projects that will have a hosted demo (everything except local-only tools). */
export const demoProjects = projects.filter((p) => !p.demoNote)
