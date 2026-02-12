'use server';

import { z } from 'zod';
import { validateEmailWithFallback } from '@/ai/validate-email';
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

type AppointmentColumnMapping = {
  locations: string[];
  dates: string[];
  types: string[];
  createdAt?: string;
  status?: string;
};

function isColumnSchemaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as Record<string, unknown>;
  const code = record.code;
  const message = String(record.message || '');
  return code === 'PGRST204' || code === '42703' || message.includes('Could not find') || message.includes('column');
}

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
    const emailValidation = await validateEmailWithFallback(email);

    if (!emailValidation.isValid) {
      return {
        success: false,
        message: emailValidation.reason || 'This email address appears to be invalid or from a disposable service. Please use a legitimate email.',
        field: 'email'
      };
    }

    const appointmentDateIso = appointmentDate.toISOString();
    const createdAtIso = new Date().toISOString();

    // Try common schema variants to support older projects that used different column names.
    const coreMappings: AppointmentColumnMapping[] = [
      {
        // Legacy deployments can have both snake_case and flat lowercase columns,
        // with the flat columns marked NOT NULL (appointmentdate/appointmenttype).
        locations: ['appointment_location'],
        dates: ['appointment_date', 'appointmentdate'],
        types: ['appointment_type', 'appointmenttype'],
      },
      {
        locations: ['appointment_location'],
        dates: ['appointment_date'],
        types: ['appointment_type'],
      },
      {
        locations: ['appointment_location'],
        dates: ['appointmentdate'],
        types: ['appointmenttype'],
      },
      {
        locations: ['appointmentLocation'],
        dates: ['appointmentDate'],
        types: ['appointmentType'],
      },
      {
        locations: ['location'],
        dates: ['date'],
        types: ['type'],
      },
      {
        locations: ['location'],
        dates: ['preferred_date'],
        types: ['type'],
      },
    ] as const;
    const metadataMappings = [
      { createdAt: 'created_at', status: 'status' },
      { createdAt: 'createdAt', status: 'status' },
      { createdAt: 'created_at' },
      { createdAt: 'createdAt' },
      { status: 'status' },
      {},
    ] as const;
    const mappings: AppointmentColumnMapping[] = coreMappings.flatMap((core) =>
      metadataMappings.map((meta) => ({ ...core, ...meta }))
    );

    let lastError: unknown = null;

    for (const mapping of mappings) {
      const payload: Record<string, unknown> = {
        name,
        email,
        message,
      };
      for (const locationColumn of mapping.locations) {
        payload[locationColumn] = appointmentLocation;
      }
      for (const dateColumn of mapping.dates) {
        payload[dateColumn] = appointmentDateIso;
      }
      for (const typeColumn of mapping.types) {
        payload[typeColumn] = appointmentType;
      }
      if (mapping.createdAt) payload[mapping.createdAt] = createdAtIso;
      if (mapping.status) payload[mapping.status] = 'pending';

      const { error } = await supabaseAdmin.from('appointments').insert(payload);
      if (!error) {
        return { success: true, message: 'Appointment requested successfully!' };
      }

      lastError = error;
      if (!isColumnSchemaError(error)) {
        break;
      }
    }

    throw lastError;

  } catch (error) {
    console.error('Error booking appointment:', error);
    const message = String((error as { message?: string })?.message || '');
    if (message.includes('schema cache') || message.includes('Could not find')) {
      return {
        success: false,
        message:
          'Appointment schema mismatch detected. Please run the latest Supabase migration for appointments columns and try again.',
      };
    }
    return {
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    };
  }
}
