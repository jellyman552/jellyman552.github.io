export type Shot = { src: string; alt: string }
export type Challenge = { title: string; body: string }
export type ReplayStep = { you: string; claude: string; tools: string[]; shot?: string; term?: string; caption: string }
export type Replay = { title: string; note: string; steps: ReplayStep[] }

export type Project = {
  slug: string
  order: number
  title: string
  tagline: string
  year: string
  stack: string[]
  highlights: string[]
  demo: string | null
  demoPlanned?: boolean
  demoNote?: string
  source: string | null
  // case-study page
  role: string
  problem: string
  challenges: Challenge[]
  next?: string[]
  tests?: number
  shots: Shot[]
  replay?: Replay
  // loaded from ./diagrams/<slug>.txt
  diagram?: string
}

// One JSON file per project in ./projects; add a file to add a project.
const files = import.meta.glob<Omit<Project, 'diagram'>>('./projects/*.json', {
  eager: true,
  import: 'default',
})
const diagrams = import.meta.glob<string>('./diagrams/*.txt', { eager: true, query: '?raw', import: 'default' })

export const projects: Project[] = Object.values(files)
  .map((p) => ({
    ...p,
    diagram: diagrams[`./diagrams/${p.slug}.txt`]?.replace(/\n+$/, ''),
  }))
  .sort((a, b) => a.order - b.order)

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
