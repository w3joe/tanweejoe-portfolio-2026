export type ExperienceEntry = {
  title: string
  organization: string
  /** Shown after title (e.g. Remote). Omit when not needed. */
  location?: string
  start: string
  end: string
  bullets: string[]
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    title: 'AI Engineer Intern',
    organization: 'Tracer',
    start: 'Mar 2026',
    end: 'Present',
    bullets: [
      'Built LangGraph-based agent workflows for OpenSRE, turning incident triage, runbooks, and operational tooling into stateful, tool-calling graphs with explicit control flow for production reliability work.',
      'Connected observability and SRE systems into those pipelines so multi-step remediation stays traceable, repeatable, and easier to extend than ad-hoc scripts during on-call.',
    ],
  },
  {
    title: 'AI Engineer',
    organization: 'PixelPro Studios',
    location: 'Remote',
    start: 'Jul 2023',
    end: 'Jan 2026',
    bullets: [
      'Engineered real-time data ingestion pipelines handling high-throughput event streams from 2000+ concurrent users, with production-grade ETL, feature extraction, and anomaly detection for downstream ML workflows.',
      'Built and deployed ML-driven automation services that reduced manual overhead by 60% and increased client acquisition by 200%, owning delivery from experimentation to production rollout.',
    ],
  },
  {
    title: 'Command Systems Platoon Commander',
    organization: 'Singapore Army',
    start: 'Jul 2023',
    end: 'May 2025',
    bullets: [
      'Designed PowerShell scripts for real-time status monitoring and automated fault detection, reducing diagnostic time by 75% across critical infrastructure.',
      'Directed deployment of hyperconverged infrastructure (Windows Server, Nutanix) for Brigade C2 systems with 99.99% uptime and reliability requirements.',
    ],
  },
  {
    title: 'Software Engineer Intern',
    organization: 'Government Technology Agency (GovTech)',
    start: 'Mar 2023',
    end: 'Jun 2023',
    bullets: [
      'Built a no-code workflow automation platform using ServiceNow and JavaScript, reducing development cycles and enabling rapid iteration on data-driven processes.',
      'Translated complex business requirements into scalable architectures using UML, with emphasis on auditability and compliance-aligned documentation.',
    ],
  },
  {
    title: 'Full-Stack Engineer Intern',
    organization:
      'Centre for Strategic Infocomm Technologies (CSIT)',
    start: 'Mar 2022',
    end: 'Aug 2022',
    bullets: [
      'Built a cloud-native platform using React, TypeScript, Java Spring Boot, MongoDB, and Docker with real-time data pipelines and behavioural analytics, driving a 50% improvement in engagement metrics.',
      'Designed data models and filtering logic for longitudinal interaction signals, improving data quality for analytics and potential NLP/LLM downstream use cases.',
    ],
  },
]
