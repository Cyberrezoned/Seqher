import type { NewsArticle } from '@/lib/types';
import { extractFirstImageUrl, makeExcerpt } from '@/lib/content/wp';

export type NewsPost = {
  slug: string;
  title: string;
  publishedDate: string; // ISO
  contentHtml: string; // WordPress HTML allowed
  category: NewsArticle['category'];
  locale: NewsArticle['locale'];
  source?: string;
  imageUrl?: string | null;
};

export const NG_NEWS_POSTS: NewsPost[] = [
  {
    slug: 'international-human-rights-day-2025',
    title: 'International Human Rights Day',
    publishedDate: '2025-12-11T00:00:00.000Z',
    category: 'Peace and Justice',
    locale: 'ng',
    contentHtml: `
      <p>Today, SEQHER stood in solidarity for human rights at the International Human Rights Day commemoration in Maiduguri, hosted by the National Human Rights Commission at Borno State Hotel.</p>
      <p>We were honored to represent our community, deliver a goodwill speech on this year’s theme <strong>“Human Rights: Our Everyday Essentials,”</strong> and advocate for justice, inclusion, and protection for the most vulnerable in Borno State.</p>
      <p>The day was enriched by meaningful engagements with dignitaries, representatives from the Nigerian Army, the Nigeria Police Force, Norwegian Church Aid, UNDP, and other key partners and advocates.</p>
      <p>We reaffirm our commitment to closing the gaps of inequality and making health, dignity, and justice an everyday reality for all.</p>
      <p><strong>HumanRightsDay</strong> #EverydayEssentials #SeqherInitiative #BornoState #NHRC</p>
    `.trim(),
  },
  {
    slug: 'breaking-the-silence-and-living-free',
    title: 'Breaking the Silence and Living Free: Health, HIV, and Stigma in Nigeria',
    publishedDate: '2025-12-01T00:00:00.000Z',
    category: 'Global Health',
    locale: 'ng',
    contentHtml: `
      <p>Join SEQHER this World AIDS Day <strong>December 1, 2025</strong> for our virtual symposium:</p>
      <p><strong>“Breaking the Silence and Living Free: Health, HIV, and Stigma in Nigeria.”</strong></p>
      <ul>
        <li><strong>Time:</strong> 3:00 – 4:30 PM (Nigerian Time)</li>
        <li><strong>Venue:</strong> Online (Registration required)</li>
      </ul>
      <p><strong>Register:</strong> <a href="https://forms.gle/QZjEkuSk7d1RhajbA" target="_blank" rel="noopener noreferrer">https://forms.gle/QZjEkuSk7d1RhajbA</a></p>
      <p>This symposium will convene advocates, health professionals, and community voices to examine the impact of stigma on HIV care and discuss how Nigerians are collectively shaping healthier, more inclusive futures.</p>
      <p>Data support will be offered to all participants, with additional gifts allocated to individuals who participate in the Q&amp;A session.</p>
      <p><strong>WorldAIDSDay</strong> #HIVAIDS #Nigeria #SeqherInitiative</p>
    `.trim(),
  },
  {
    slug: 'nigerias-healthcare-sector-failing-trans-community',
    title: 'Nigeria’s Healthcare Sector Is Failing Trans Community — Here’s What Must Change',
    publishedDate: '2025-11-17T00:00:00.000Z',
    category: 'Global Health',
    locale: 'ng',
    contentHtml: `
      <p>Across Nigeria, the healthcare system is meant to serve every individual with dignity, respect, and professionalism. Yet for many transgender people, walking into a clinic is not an act of care — it is an act of courage.</p>
      <p>Too many trans Nigerians delay treatment until emergencies, avoid hospitals entirely, or seek care in unsafe or unregulated spaces. This is not because they do not value their health, but because the healthcare environment often communicates one message loudly: “You are not safe here.”</p>

      <h2>The Barriers Are Deep, Systemic, and Preventable</h2>
      <ul>
        <li><strong>Stigma and discrimination in clinical settings:</strong> from ridicule about gender identity to refusal of services.</li>
        <li><strong>Lack of trained, affirming healthcare providers:</strong> limited understanding of trans health needs and trauma‑informed care.</li>
        <li><strong>Misinformation and harmful stereotypes:</strong> patients reduced to assumptions about morality or disease.</li>
        <li><strong>Legal and social hostility:</strong> fear around rights, confidentiality, and continuity of care.</li>
      </ul>

      <h2>What the Health Sector Must Do Better</h2>
      <ul>
        <li>Train healthcare workers on gender‑affirming care, respectful communication, confidentiality, and ethical practice.</li>
        <li>Create safe and affirming healthcare spaces with visible policies and trained staff.</li>
        <li>Ensure confidentiality and data protection.</li>
        <li>Develop referral pathways for mental health, hormonal care, HIV services, and general healthcare.</li>
        <li>Collaborate with community‑led organizations and design with trans communities.</li>
      </ul>

      <h2>Why This Matters For Everyone</h2>
      <p>A healthcare system that excludes anyone fails everyone. Improving trans healthcare is not about special treatment — it is about equal treatment, medically sound practice, and basic human dignity.</p>
    `.trim(),
  },
  {
    slug: 'open-position-medical-officer',
    title: 'Open Position for Medical Officer',
    publishedDate: '2025-10-28T00:00:00.000Z',
    category: 'Economic Growth',
    locale: 'ng',
    contentHtml: `
      <h2>Terms of Reference</h2>
      <p><strong>Position Title:</strong> Medical Officer<br/>
      <strong>Location:</strong> Borno State, Nigeria<br/>
      <strong>Contract Duration:</strong> 1 December 2025 – 30 April 2026 (6 months, with possibility of extension up to 18 months)<br/>
      <strong>Release Date:</strong> Monday, October 27, 2025<br/>
      <strong>Application Deadline:</strong> November 14, 2025</p>

      <h3>How to Apply</h3>
      <p>Please merge your documents into a single PDF and email to <a href="mailto:job@seqher.org">job@seqher.org</a> and copy <a href="mailto:alfred@seqher.org">alfred@seqher.org</a> with the subject line: <strong>“Medical Officer – Borno”</strong>.</p>
      <p>Send questions and enquiries to: <a href="mailto:info@seqher.org">info@seqher.org</a> and copy <a href="mailto:seqher2020@gmail.com">seqher2020@gmail.com</a>.</p>
    `.trim(),
  },
  {
    slug: 'open-position-laboratory-scientist',
    title: 'Open Position for Laboratory Scientist',
    publishedDate: '2025-10-28T00:00:00.000Z',
    category: 'Economic Growth',
    locale: 'ng',
    contentHtml: `
      <h2>Terms of Reference</h2>
      <p><strong>Position Title:</strong> Laboratory Scientist<br/>
      <strong>Location:</strong> Borno State, Nigeria<br/>
      <strong>Contract Duration:</strong> 1 December 2025 – 30 April 2026 (6 months, with possibility of extension up to 18 months)<br/>
      <strong>Release Date:</strong> Monday, October 27, 2025<br/>
      <strong>Application Deadline:</strong> November 14, 2025</p>

      <h3>How to Apply</h3>
      <p>Please merge your documents into a single PDF and email to <a href="mailto:job@seqher.org">job@seqher.org</a> and copy <a href="mailto:alfred@seqher.org">alfred@seqher.org</a> with the subject line: <strong>“Laboratory Scientist – Borno”</strong>.</p>
      <p>Send questions and enquiries to: <a href="mailto:info@seqher.org">info@seqher.org</a> and copy <a href="mailto:seqher2020@gmail.com">seqher2020@gmail.com</a>.</p>
    `.trim(),
  },
  {
    slug: 'open-position-gbv-officer',
    title: 'Open Position for GBV Officer (Gender-Based Violence)',
    publishedDate: '2025-10-28T00:00:00.000Z',
    category: 'Peace and Justice',
    locale: 'ng',
    contentHtml: `
      <h2>Terms of Reference</h2>
      <p><strong>Position Title:</strong> GBV Officer (Gender‑Based Violence)<br/>
      <strong>Location:</strong> Borno State, Nigeria<br/>
      <strong>Contract Duration:</strong> 1 December 2025 – 30 April 2026 (6 months, with possibility of extension up to 18 months)<br/>
      <strong>Release Date:</strong> Monday, October 27, 2025<br/>
      <strong>Application Deadline:</strong> November 14, 2025</p>

      <h3>How to Apply</h3>
      <p>Please merge your documents into a single PDF and email to <a href="mailto:job@seqher.org">job@seqher.org</a> and copy <a href="mailto:Alfred@seqher.org">Alfred@seqher.org</a> with the subject line: <strong>“GBV Officer – Borno”</strong>.</p>
      <p>Send questions and enquiries to: <a href="mailto:info@seqher.org">info@seqher.org</a> and copy <a href="mailto:seqher2020@gmail.com">seqher2020@gmail.com</a>.</p>
    `.trim(),
  },
  {
    slug: 'open-position-program-assistant',
    title: 'Open Position For Program Assistant',
    publishedDate: '2025-10-27T00:00:00.000Z',
    category: 'Economic Growth',
    locale: 'ng',
    contentHtml: `
      <p><strong>Position Title:</strong> Program Assistant<br/>
      <strong>Location:</strong> Borno State, Nigeria<br/>
      <strong>Contract Duration:</strong> 1 December 2025 – 30 April 2026 (6 months, with possibility of extension up to 18 months)<br/>
      <strong>Release Date:</strong> Monday, October 27, 2025<br/>
      <strong>Application Deadline:</strong> November 14, 2025</p>

      <h3>How to Apply</h3>
      <p>Please merge your documents into a single PDF and email to <a href="mailto:job@seqher.org">job@seqher.org</a> and copy <a href="mailto:alfred@seqher.org">alfred@seqher.org</a> with the subject line: <strong>“Program Assistant – Borno”</strong>.</p>
    `.trim(),
  },
  {
    slug: 'official-statement-justice-for-hilary',
    title: 'Official Statement on the Tragic Murder of Hilary and the Ongoing Violence Against LGBTQI Persons in Nigeria',
    publishedDate: '2025-10-27T00:00:00.000Z',
    category: 'Peace and Justice',
    locale: 'ng',
    contentHtml: `
      <p>Hilary’s life was brutally cut short by hate, deceit, and violence — a reminder of the growing danger faced by LGBTQI+ persons in Nigeria.</p>
      <p>This death is not an isolated tragedy, but part of a wider pattern of injustice sustained by silence and impunity.</p>
      <p>At the Society for Equal Health and Rights (SEQHER), we stand in solidarity with Hilary and every LGBTQI+ person who has been harmed, silenced, or lost to violence. We call for justice, accountability, and an end to hate‑driven attacks.</p>
      <p><strong>No one should lose their life for simply being who they are.</strong></p>
      <p>#JusticeForHilary #EndTheViolence #ProtectLGBTQILives #HumanRightsForAll</p>
    `.trim(),
  },
  {
    slug: 'new-immigrant-healthcare-support-program',
    title: 'New Immigrant Healthcare Support Program',
    publishedDate: '2025-06-16T00:00:00.000Z',
    category: 'Global Health',
    locale: 'ng',
    contentHtml: `
      <p>Join us for a vital health outreach event!</p>
      <p><strong>New Immigrant Healthcare Support Ambassador program</strong> invites you to an insightful session.</p>
      <h3>Topic Highlights</h3>
      <ul>
        <li>Hypertension and its impact on new immigrants</li>
        <li>Mental health challenges in the immigrant journey</li>
        <li>How Artificial Intelligence is transforming immigrant healthcare</li>
      </ul>
      <p><strong>Date:</strong> Tuesday, June 17, 2025<br/>
      <strong>Time:</strong> 6:00 PM<br/>
      <strong>Location:</strong> 200 Redpath Avenue, 39th Floor, Toronto, ON</p>
      <p>If you can’t make it in person, join on Zoom:<br/>
      <a href="https://us05web.zoom.us/j/84080881796?pwd=wn90W6DnyCzZLXbPbtkp9x2ca7AVVH.1" target="_blank" rel="noopener noreferrer">Zoom link</a></p>
      <p><strong>Meeting ID:</strong> 840 8088 1796<br/>
      <strong>Passcode:</strong> SEQHER</p>
      <p>For inquiries: <a href="mailto:seqher2020@gmail.com">seqher2020@gmail.com</a></p>
    `.trim(),
  },
  {
    slug: 'vogue-for-awareness-dance-class-session-one',
    title: 'Vogue for Awareness Dance Class — Session One',
    publishedDate: '2025-06-01T00:00:00.000Z',
    category: 'Sustainability',
    locale: 'ng',
    contentHtml: `
      <p><strong>Fun and Cunty!</strong> was the theme of the first edition of the Vogue for Awareness class.</p>
      <p>If you missed it, here’s a little rundown — and you don’t want to miss the next one.</p>
      <p>#TransgenderAwarenessWeek #TAW #TransIsBeautiful #TransgenderAdvocacy</p>
    `.trim(),
  },
];

export function getNgNewsPost(slug: string): NewsPost | null {
  return NG_NEWS_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getNgNewsArticles(): NewsArticle[] {
  return NG_NEWS_POSTS
    .slice()
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .map((post) => {
      const imageUrl = post.imageUrl ?? extractFirstImageUrl(post.contentHtml);
      return {
        id: post.slug,
        title: post.title,
        source: post.source ?? 'SEQHER',
        publishedDate: post.publishedDate,
        summary: makeExcerpt(post.contentHtml, 180),
        imageId: 'news-hero',
        imageUrl: imageUrl ?? null,
        link: `/ng/news/${post.slug}`,
        category: post.category,
        locale: post.locale,
      };
    });
}

