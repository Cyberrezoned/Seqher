export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: 'current' | 'past';
  funder?: string;
  yearLabel?: string;
  imageUrl?: string | null;
};

export const NG_PROJECTS: Project[] = [
  {
    slug: 'awareness-and-consciousness-creation',
    title: 'Development of Awareness and Facilitation of Consciousness Creation',
    summary:
      'Enhancing protection for LGBTQI+ communities, strengthening community-led organizing, and expanding acceptance and tolerance.',
    description:
      'This project strengthens community-led action and improves legal and social protection by increasing understanding of rights and connecting people to supportive services. It also engages state and non-state actors to reduce stigma, discrimination, and rights violations such as arbitrary arrest, unlawful detention, ill-treatment, and extortion.',
    status: 'current',
    funder: 'Supported and funded by ISDAO.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&h=1000&q=80',
  },
  {
    slug: 'leadership-governance-and-management',
    title: 'Effective Organizational Leadership, Governance and Management',
    summary: 'A 6‑month capacity-building initiative to strengthen SEQHER staff leadership, governance, and management skills.',
    description:
      'This initiative builds practical skills and systems that enable effective service delivery, accountability, and sustainable impact across SEQHER’s work.',
    status: 'current',
    funder: 'Piloted by Grantshub with funding from Kaleidoscope.',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&h=1000&q=80',
  },
  {
    slug: 'seqher-abode',
    title: 'SEQHER ABODE (Safe Housing)',
    summary:
      'A 12‑month safe-housing initiative supporting displaced individuals from gender-diverse and sexual minority communities in Borno State.',
    description:
      'SEQHER ABODE provides an extensive support system for 50 displaced individuals, addressing homelessness, violence, and discrimination through safe accommodation, case support, and referrals for health, legal, and psychosocial services.',
    status: 'current',
    funder: 'Funded by Rainbow Railroad.',
    imageUrl: '/images/team/exec-leadership-01.jpeg',
  },
  {
    slug: 'maiduguri-flood-relief-response-2024',
    title: 'Maiduguri Flood Relief Response',
    summary: 'Rapid community support and referrals for people impacted by flooding in Maiduguri.',
    description:
      'In response to flooding and displacement, SEQHER supported community coordination, information-sharing, and referrals to partners providing humanitarian assistance.',
    status: 'past',
    yearLabel: '2024',
    imageUrl: 'https://sirpek.wordpress.com/wp-content/uploads/2024/09/img_8647.jpeg?w=1200',
  },
  {
    slug: 'world-suicide-prevention-day-2024',
    title: 'World Suicide Prevention Day Activities',
    summary: 'Community awareness and wellbeing messaging to support mental health for everyone.',
    description:
      'SEQHER led community engagement and awareness activities focused on mental wellbeing, early support, and stigma reduction around mental health.',
    status: 'past',
    yearLabel: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1600&h=1000&q=80',
  },
  {
    slug: '16-days-of-activism-2024',
    title: '16 Days of Activism',
    summary: 'Community-led engagement and advocacy to advance safety, dignity, and equality.',
    description:
      'During 16 Days of Activism, SEQHER supported awareness-raising, conversations, and community learning focused on safety, inclusion, and rights.',
    status: 'past',
    yearLabel: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1520975958225-56f4b6f506b8?auto=format&fit=crop&w=1600&h=1000&q=80',
  },
];

export function getNgCurrentProjects(): Project[] {
  return NG_PROJECTS.filter((p) => p.status === 'current');
}

export function getNgPastProjects(): Project[] {
  return NG_PROJECTS.filter((p) => p.status === 'past');
}

