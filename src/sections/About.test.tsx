import { render, screen } from '@testing-library/react'
import About from './About'
import { skills } from '../data/skills'
import { education } from '../data/education'

const groups = [
  [
    'AI/ML',
    'LLMs, Agent Orchestration, Multi-Agent Systems, MCP, Claude, ' +
      'Gemini, PyTorch, Scikit-learn',
  ],
  ['Languages', 'Python, TypeScript, JavaScript (ES6+), C/C++, SQL'],
  [
    'Web',
    'React, Node.js, Express, PostgreSQL, MongoDB, REST APIs, HTML5, CSS3',
  ],
  [
    'Infrastructure',
    'GCP (BigQuery, GCS), Docker, Kubernetes/k3s, Redis, nginx, ' +
      'Uvicorn, CI/CD',
  ],
  [
    'Tools',
    'Git, Linux, Vitest, pytest, Firecrawl, Jira, Confluence, Agile/Scrum',
  ],
]

describe('About', () => {
  it('has Education and Skills h3 headings', () => {
    render(<About />)
    for (const name of ['Education', 'Skills'])
      expect(
        screen.getByRole('heading', { level: 3, name }),
      ).toBeInTheDocument()
  })

  it('renders five skill terms in order with exact definitions', () => {
    render(<About />)
    const terms = screen.getAllByRole('term')
    expect(terms.map((t) => t.textContent)).toEqual(groups.map((g) => g[0]))
    const defs = screen.getAllByRole('definition')
    expect(defs.map((d) => d.textContent)).toEqual(groups.map((g) => g[1]))
  })

  it('skills data equals the content file', () => {
    expect(skills.map((g) => [g.category, g.items.join(', ')])).toEqual(
      groups,
    )
  })

  it('education data equals the content file', () => {
    expect(education).toEqual({
      school: 'California Polytechnic State University, San Luis Obispo',
      degree: 'Bachelor of Science in Computer Science, Minor in Philosophy',
      detail: 'Graduated Aug 2025',
      honor: "Dean's List — Fall 2024 & Spring 2025 (Senior Year)",
      certification: {
        name: 'AWS Academy Cloud Security Foundations',
        issuer: 'Amazon Web Services, Dec 2024',
      },
    })
  })
})
