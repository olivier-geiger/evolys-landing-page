"use server";

import { Resend } from "resend";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Missing required fields" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Invalid email format" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      return { success: true };
    }
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Evolys Contact <noreply@updates.evolys.fr>",
      to: ["olivier.codes@gmail.com"],
      replyTo: email,
      subject: `[Evolys] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Message</h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 16px 16px;">
            <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">
                <strong style="color: #374151;">From:</strong> ${name}
              </p>
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">
                <strong style="color: #374151;">Email:</strong>
                <a href="mailto:${email}" style="color: #8b5cf6;">${email}</a>
              </p>
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">
                <strong style="color: #374151;">Subject:</strong> ${subject}
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}
