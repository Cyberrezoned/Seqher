export type GrantOpportunity = {
  slug: string;
  title: string;
  deadlineLabel: string;
  summary: string;
  contentHtml: string;
};

export const NG_GRANTS: GrantOpportunity[] = [
  {
    slug: 'community-resilience-microgrant',
    title: 'Community Resilience Micro‑Grant (Pilot)',
    deadlineLabel: 'Rolling (while funds last)',
    summary:
      'A small-grants opportunity to support community-led actions that improve wellbeing, safety, and access to essential services for vulnerable populations in Nigeria.',
    contentHtml: `
      <h2>Overview</h2>
      <p>This pilot supports community-led initiatives that advance equal health and rights. Funding is intended for practical, locally driven actions with clear community benefit.</p>

      <h2>What we fund</h2>
      <ul>
        <li>Community outreach and referral pathways</li>
        <li>Health promotion and wellbeing activities</li>
        <li>Safety, inclusion, and rights-based support initiatives</li>
      </ul>

      <h2>How to apply</h2>
      <p>Full eligibility, budget guidance, and the application link are available to subscribers.</p>
    `.trim(),
  },
  {
    slug: 'climate-justice-health-innovation',
    title: 'Climate Justice & Health Innovation Fund',
    deadlineLabel: 'Next cohort announcement coming soon',
    summary:
      'An upcoming funding opportunity focused on climate change, justice, and resilience—supporting solutions that protect health and strengthen communities facing humanitarian shocks.',
    contentHtml: `
      <h2>Overview</h2>
      <p>This fund will prioritize climate-related health risks, disaster preparedness, and resilience building—especially for communities impacted by conflict, displacement, flooding, and other emergencies.</p>

      <h2>Priority areas</h2>
      <ul>
        <li>Community resilience and emergency preparedness</li>
        <li>Climate-related health education and risk reduction</li>
        <li>Protection and inclusion for marginalized communities during crises</li>
      </ul>

      <h2>How to access full details</h2>
      <p>Subscribers can view timelines, eligibility criteria, and full application instructions.</p>
    `.trim(),
  },
];

