export const profile = {
  name: 'Jagger Nelson',
  handle: 'jagger',
  location: 'Sacramento, CA',
  role: 'Full-stack developer',
  tagline:
    'I build tools people use every day, end to end: data model, backend, UI and deployment. Python, Flask, React and Docker, running on real servers.',
  email: 'jaggernelson64@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jagger-nelson',
  github: 'https://github.com/jellyman552',
  resume: '/Jagger_Nelson_Resume.pdf',
  about: [
    "I came to software from chemistry. My first full-stack work was in 2023 as team lead in UC San Diego Police Department's CSO program, where we replaced a dispatch database built in Access with a React and SQL web app, then built a scheduling system that spreads shifts fairly.",
    'At Orca Bio, a cell-therapy manufacturer, I built OrcaHub, a Flask and React app on AWS for QA and manufacturing staff, along with scheduling, training and shift-handoff tools for the cryo team.',
    "I build with Claude Code as a pair programmer. I make the design decisions, own the data model, and run what I ship. The projects above are tools I use daily, running in Docker on my own Oracle Cloud server.",
  ],
}

export type Job = {
  org: string
  role: string
  when: string
  points: string[]
}

export const experience: Job[] = [
  {
    org: 'Orca Bio',
    role: 'Associate, Cold Chain Handling & Cryopreservation',
    when: 'Apr 2026 – Nov 2026',
    points: [
      'Designed and built OrcaHub (Flask, React, Okta SSO, AWS ECS/Docker) for 10–100 QA and manufacturing users: deviation tracking synced from MasterControl, batch and operator scheduling checked against training records, and downtime tracking. Took it through user acceptance testing.',
      'Cut the scheduling page load from ~60s to under 3s by reducing ~8,400 database queries per load to ~180, with connection pooling and request-scoped caching.',
      'Built a cryo scheduler, a training site and a shift-passdown app that posts to Slack, saving an estimated ~800 hours of manual work a year.',
      'Integrated Slack and SharePoint (Microsoft Graph) with credentials kept in AWS Secrets Manager; drafted the GxP impact assessment.',
    ],
  },
  {
    org: 'Eurofins Environment Testing',
    role: 'LCMS Prep Analyst I',
    when: 'Jul 2025 – Apr 2026',
    points: ['Prepared PFAS samples by solid-phase extraction (EPA 1633) and recorded QA/QC results in LIMS.'],
  },
  {
    org: 'UC San Diego Police Department',
    role: 'Community Service Officer · Software team lead',
    when: '2023',
    points: [
      'Led the move from an outdated Access dispatch database to a React + Vite web app on a SQL database.',
      'Built a scheduling system on the same stack that distributes shifts fairly across officers.',
    ],
  },
]

export const education = [
  { what: 'B.S. Environmental Chemistry', where: 'UC San Diego', when: '2025' },
  { what: "CS50's Introduction to Programming with Python (CS50P)", where: 'Harvard', when: 'In progress' },
]
