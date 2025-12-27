'use server';

import { z } from 'zod';

import { validateEmail } from '@/ai/flows/validate-email-with-llm';
import { supabaseAdmin } from '@/lib/supabase-admin';

const volunteerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  preferredLocation: z.string().min(2),
  interests: z.array(z.string()).default([]),
  message: z.string().max(800).optional(),
  locale: z.enum(['ng', 'ca', 'global']).default('ng'),
});

type FormState = {
  success: boolean;
  message: string;
  field?: string;
};

export async function submitVolunteerForm(values: z.infer<typeof volunteerSchema>): Promise<FormState> {
  const parsed = volunteerSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: 'Invalid form data.' };

  const { name, email, phone, preferredLocation, interests, message, locale } = parsed.data;

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

    const { error } = await supabaseAdmin.from('volunteer_applications').insert({
      name,
      email,
      phone: phone?.trim() ? phone.trim() : null,
      preferred_location: preferredLocation,
      interests,
      message: message?.trim() ? message.trim() : null,
      locale,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { success: true, message: 'Thanks! Your volunteer information has been received.' };
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    return { success: false, message: 'An unexpected server error occurred. Please try again later.' };
  }
}

