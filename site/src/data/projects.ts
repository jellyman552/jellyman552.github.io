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
}

// Each project is one JSON file in ./projects — add a file to add a project.
const modules = import.meta.glob<Project>('./projects/*.json', { eager: true, import: 'default' })

export const projects: Project[] = Object.values(modules).sort((a, b) => a.order - b.order)
