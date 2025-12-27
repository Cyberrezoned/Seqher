'use server';

import { z } from 'zod';

import { validateEmail } from '@/ai/flows/validate-email-with-llm';
import { supabaseAdmin } from '@/lib/supabase-admin';

const subscribeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  locale: z.enum(['ng', 'ca', 'global']).default('ng'),
});

type FormState = {
  success: boolean;
  message: string;
  field?: string;
};

export async function subscribeForNewsUpdates(values: z.infer<typeof subscribeSchema>): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: 'Invalid form data.' };

  const { name, email, locale } = parsed.data;

  try {
    const emailValidation = await validateEmail({ email });

    if (!emailValidation.isValid) {
      return {
        success: false,
        message:
          emailValidation.reason ||
          'This email address appears to be invalid or from a disposable service. Please use a legitimate email.',
        field: 'email',
      };
    }

    const { error } = await supabaseAdmin.from('news_subscribers').insert({
      name,
      email,
      locale,
      created_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'You are already subscribed for news updates.' };
      }
      throw error;
    }

    return { success: true, message: 'Subscribed successfully! We will email you news updates.' };
  } catch (error) {
    console.error('Error subscribing for news updates:', error);
    return { success: false, message: 'An unexpected server error occurred. Please try again later.' };
  }
}

