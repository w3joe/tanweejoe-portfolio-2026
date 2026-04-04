export type CompetencyGroup = {
  title: string
  description: string
  skills: string[]
}

export const COMPETENCIES: CompetencyGroup[] = [
  {
    title: 'Frontend Development',
    description:
      'Crafting beautiful, responsive user interfaces with modern frameworks.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
  },
  {
    title: 'Backend Development',
    description:
      'Building robust server-side applications and scalable APIs.',
    skills: ['Node.js', 'Python', 'Express', 'REST APIs', 'GraphQL'],
  },
  {
    title: 'Database & Cloud',
    description: 'Designing efficient data architectures and cloud solutions.',
    skills: ['PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Redis'],
  },
  {
    title: 'DevOps & Tools',
    description:
      'Streamlining development workflows and deployment processes.',
    skills: ['Git', 'CI/CD', 'Linux', 'Testing', 'Agile'],
  },
  {
    title: 'Machine Learning & AI',
    description:
      'Building intelligent systems that learn from data and support informed decisions.',
    skills: [
      'Python',
      'TensorFlow',
      'PyTorch',
      'Scikit-learn',
      'Data Analysis',
    ],
  },
]
