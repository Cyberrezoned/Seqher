import NigeriaHomeClient from '@/app/ng/NigeriaHomeClient';
import { getStaticAnnouncements, getStaticPrograms } from '@/lib/content/static';
import type { Program } from '@/lib/types';

export const dynamic = 'force-static';

export default function NigeriaHomePage() {
  const programs = getStaticPrograms('ng');
  const featuredIds = ['hiv-sti-prep', 'rights-legal-aid', 'gender-affirming-care', 'skills-livelihood-empowerment'] as const;
  const featuredPrograms: Program[] = featuredIds
    .map((id) => programs.find((p) => p.id === id))
    .filter(Boolean) as Program[];

  if (featuredPrograms.length < 4) {
    const seen = new Set(featuredPrograms.map((p) => p.id));
    for (const program of programs) {
      if (featuredPrograms.length >= 4) break;
      if (seen.has(program.id)) continue;
      featuredPrograms.push(program);
      seen.add(program.id);
    }
  }
  const announcements = getStaticAnnouncements('ng').slice(0, 1);
  return <NigeriaHomeClient featuredPrograms={featuredPrograms} announcements={announcements} />;
}
