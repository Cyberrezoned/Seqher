'use server';

import { z } from 'zod';
import { validateEmail } from '@/ai/flows/validate-email-with-llm';
import { supabaseAdmin } from '@/lib/supabase-admin';

const appointmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  appointmentLocation: z.string().min(2),
  appointmentDate: z.date(),
  appointmentType: z.enum(['volunteering', 'partnership', 'general']),
  message: z.string().max(500).optional(),
});

type FormState = {
  success: boolean;
  message: string;
  field?: string;
};

export async function bookAppointment(
  values: z.infer<typeof appointmentSchema>
): Promise<FormState> {
  const parsed = appointmentSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  const { email, name, appointmentLocation, appointmentDate, appointmentType, message } = parsed.data;

  try {
    // Use GenAI to validate email
    const emailValidation = await validateEmail({ email });

    if (!emailValidation.isValid) {
      return {
        success: false,
        message: emailValidation.reason || 'This email address appears to be invalid or from a disposable service. Please use a legitimate email.',
        field: 'email'
      };
    }

    // Save the appointment to Supabase (map camelCase to snake_case)
    const { error } = await supabaseAdmin
      .from('appointments')
      .insert({
        name,
        email,
        appointment_location: appointmentLocation,
        appointment_date: appointmentDate,
        appointment_type: appointmentType,
        message,
        created_at: new Date().toISOString(),
        status: 'pending',
      });

    if (error) throw error;

    return { success: true, message: 'Appointment requested successfully!' };

  } catch (error) {
    console.error('Error booking appointment:', error);
    return {
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    };
  }
}
