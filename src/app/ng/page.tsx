import NigeriaHomeClient from '@/app/ng/NigeriaHomeClient';
import { getStaticAnnouncements, getStaticPrograms } from '@/lib/content/static';

export const dynamic = 'force-static';

export default function NigeriaHomePage() {
  const featuredPrograms = getStaticPrograms('ng').slice(0, 3);
  const announcements = getStaticAnnouncements('ng').slice(0, 1);
  return <NigeriaHomeClient featuredPrograms={featuredPrograms} announcements={announcements} />;
}

