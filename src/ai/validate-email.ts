'use server';

export type EmailValidationResult = {
  isValid: boolean;
  reason?: string;
};

export async function validateEmailWithFallback(email: string): Promise<EmailValidationResult> {
  const hasGoogleAiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  if (!hasGoogleAiKey) return { isValid: true };

  const { validateEmail } = await import('@/ai/flows/validate-email-with-llm');
  return validateEmail({ email });
}
