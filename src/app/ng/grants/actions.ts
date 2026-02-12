'use server';

import { z } from 'zod';

import { validateEmailWithFallback } from '@/ai/validate-email';
import { supabaseAdmin } from '@/lib/supabase-admin';

const subscribeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  plan: z.enum(['monthly', 'annual']),
  locale: z.enum(['ng', 'ca', 'global']).default('ng'),
});

type FormState = {
  success: boolean;
  message: string;
  field?: string;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as Record<string, unknown>;
  const code = record.code;
  const message = String(record.message || '');
  return code === 'PGRST205' || message.includes('Could not find the table');
}

export async function subscribeForGrantAccess(values: z.infer<typeof subscribeSchema>): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: 'Invalid form data.' };

  const { name, email, plan, locale } = parsed.data;

  try {
    const emailValidation = await validateEmailWithFallback(email);

    if (!emailValidation.isValid) {
      return {
        success: false,
        message:
          emailValidation.reason ||
          'This email address appears to be invalid or from a disposable service. Please use a legitimate email.',
        field: 'email',
      };
    }

    const { error } = await supabaseAdmin.from('grant_subscriptions').insert({
      name,
      email,
      plan,
      locale,
      created_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'You already have access on this email. Thank you.' };
      }
      if (isMissingTableError(error)) {
        return {
          success: false,
          message:
            'Grant subscription is not configured in Supabase yet. Ask the admin to run the latest Supabase schema migration and try again.',
        };
      }
      throw error;
    }

    return {
      success: true,
      message: 'Subscription saved. You can now view full grant details on this device.',
    };
  } catch (error) {
    console.error('Error subscribing for grant access:', error);
    return { success: false, message: 'An unexpected server error occurred. Please try again later.' };
  }
}
