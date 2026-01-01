import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const region = cookies().get('seqher_region')?.value;
  if (region === 'ca') redirect('/ca');
  redirect('/ng');
}

