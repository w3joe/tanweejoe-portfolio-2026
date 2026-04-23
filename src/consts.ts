import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Tan Wee Joe',
  description:
    'AI Research Engineer: mechanistic interpretability, world models, multi-agent coordination, and human-aligned AGI.',
  href: 'https://tanweejoe.com',
  author: 'Tan Wee Joe',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/w3joe',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/tanweejoe',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:tanweejoe@gmail.com',
    label: 'Email',
  },
  {
    href: 'https://huggingface.co/w3joe',
    label: 'Hugging Face',
  },
  {
    href: 'https://scholar.google.com/citations?user=VRQuj7sAAAAJ&hl=en',
    label: 'Google Scholar',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
  'Hugging Face': 'lucide:brain',
  'Google Scholar': 'lucide:graduation-cap',
}
