'use server';

import { z } from 'zod';

import { subscribeForGrantAccess } from '@/app/ng/grants/actions';
import { subscribeForNewsUpdates } from '@/app/ng/news/actions';

const subscribeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  topics: z.array(z.enum(['news', 'grants', 'organization_updates'])).min(1),
  grantPlan: z.enum(['monthly', 'annual']).optional(),
});

type FormState = {
  success: boolean;
  message: string;
  field?: string;
};

export async function subscribeToNigeriaUpdates(values: z.infer<typeof subscribeSchema>): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  const { name, email, topics, grantPlan } = parsed.data;
  const shouldSubscribeNews = topics.includes('news') || topics.includes('organization_updates');
  const shouldSubscribeGrants = topics.includes('grants');
  const failures: string[] = [];

  if (shouldSubscribeNews) {
    const result = await subscribeForNewsUpdates({
      name,
      email,
      locale: 'ng',
    });
    if (!result.success) failures.push(result.message);
  }

  if (shouldSubscribeGrants) {
    const result = await subscribeForGrantAccess({
      name,
      email,
      locale: 'ng',
      plan: grantPlan ?? 'monthly',
    });
    if (!result.success) failures.push(result.message);
  }

  if (failures.length > 0) {
    return {
      success: false,
      message: failures.join(' '),
    };
  }

  return {
    success: true,
    message:
      'Subscription saved. You will receive Nigeria news, grants, and organizational update communications based on your selected categories.',
  };
}
