import { Resend } from "resend";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export interface WelcomeEmailProps {
    email: string;
    name?: string;
}

interface ContactEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}

export const sendWelcomeEmail = async ({ email, name }: WelcomeEmailProps) => {
    if (!resend) {
        console.warn("Resend API key not configured, skipping email send");
        return { id: "no-resend-key" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "Pancham Khaitan <hello@updates.panchamkhaitan.com>",
            to: [email],
            subject: "Welcome to my newsletter!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #43aa8b; margin-bottom: 20px;">Welcome to my newsletter!</h1>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            ${name ? `Hi ${name},` : "Hi there,"}
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Thank you for subscribing to my newsletter! I'm excited to share my thoughts, 
            projects, and insights with you.
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            You can expect to hear from me with:
          </p>
          
          <ul style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            <li>New blog posts and articles</li>
            <li>Updates on my latest projects</li>
            <li>Thoughts on technology and software development</li>
            <li>Occasional behind-the-scenes content</li>
          </ul>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 30px;">
            I promise to never spam you, and you can unsubscribe at any time.
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Best regards,<br>
            <strong>Pancham Khaitan</strong>
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 12px; line-height: 1.4;">
              You received this email because you signed up for my newsletter at panchamkhaitan.com
            </p>
          </div>
        </div>
      `,
            text: `
        Welcome to my newsletter!
        
        ${name ? `Hi ${name},` : "Hi there,"}
        
        Thank you for subscribing to my newsletter! I'm excited to share my thoughts, projects, and insights with you.
        
        You can expect to hear from me with:
        - New blog posts and articles
        - Updates on my latest projects
        - Thoughts on technology and software development
        - Occasional behind-the-scenes content
        
        I promise to never spam you, and you can unsubscribe at any time.
        
        Best regards,
        Pancham Khaitan
      `,
        });

        if (error) {
            console.error("Error sending welcome email:", error);
            throw error;
        }

        console.warn("Welcome email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to send welcome email:", error);
        throw error;
    }
};

export const sendContactEmails = async ({
    firstName,
    lastName,
    email,
    subject,
    message,
}: ContactEmailProps) => {
    if (!resend) {
        console.warn(
            "Resend API key not configured, skipping contact email send",
        );
        return { visitorEmail: "no-resend-key", ownerEmail: "no-resend-key" };
    }

    const fromAddress = "Pancham Khaitan <hello@updates.panchamkhaitan.com>";
    const ownerEmail =
        process.env.PROFESSIONAL_EMAIL || "hello@panchamkhaitan.com";

    try {
        const [visitorResponse, ownerResponse] = await Promise.all([
            resend.emails.send({
                from: fromAddress,
                to: [email],
                subject: "Message received",
                html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #000;">
            <div style="margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: #000;">Thanks for reaching out</h1>
              <p style="font-size: 16px; line-height: 1.6; margin: 0; color: #525252;">
                Hey ${firstName}, I've received your message and will get back to you as soon as possible.
              </p>
            </div>

            <div style="margin: 32px 0; padding: 24px; background: #fafafa; border-radius: 4px;">
              <div style="margin-bottom: 20px;">
                <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: #737373;">Subject</p>
                <p style="font-size: 16px; margin: 0; color: #000; font-weight: 500;">${subject}</p>
              </div>

              <div>
                <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: #737373;">Message</p>
                <p style="font-size: 15px; line-height: 1.6; margin: 0; color: #000; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
              <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #525252;">
                Pancham Khaitan<br/>
                <a href="https://panchamkhaitan.com" style="color: #000; text-decoration: none;">panchamkhaitan.com</a>
              </p>
            </div>
          </div>
        `,
                text: `
Thanks for reaching out

Hey ${firstName}, I've received your message and will get back to you as soon as possible.

SUBJECT
${subject}

MESSAGE
${message}

---

Pancham Khaitan
panchamkhaitan.com
        `,
            }),
            resend.emails.send({
                from: fromAddress,
                to: [ownerEmail],
                replyTo: email,
                subject: `New message: ${subject}`,
                html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #000;">
            <div style="margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 8px 0; color: #000;">New contact message</h1>
              <p style="font-size: 14px; margin: 0; color: #737373;">${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</p>
            </div>

            <div style="margin: 32px 0; padding: 24px; background: #fafafa; border-radius: 4px;">
              <div style="margin-bottom: 20px;">
                <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: #737373;">From</p>
                <p style="font-size: 16px; margin: 0 0 4px 0; color: #000; font-weight: 500;">${firstName} ${lastName}</p>
                <p style="font-size: 14px; margin: 0; color: #525252;">${email}</p>
              </div>

              <div style="margin-bottom: 20px;">
                <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: #737373;">Subject</p>
                <p style="font-size: 16px; margin: 0; color: #000; font-weight: 500;">${subject}</p>
              </div>

              <div>
                <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; color: #737373;">Message</p>
                <p style="font-size: 15px; line-height: 1.6; margin: 0; color: #000; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <div style="margin-top: 32px;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">Reply to ${firstName}</a>
            </div>
          </div>
        `,
                text: `
NEW CONTACT MESSAGE
${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}

FROM
${firstName} ${lastName}
${email}

SUBJECT
${subject}

MESSAGE
${message}

---
Reply to: ${email}
        `,
            }),
        ]);

        return { visitorEmail: visitorResponse, ownerEmail: ownerResponse };
    } catch (error) {
        console.error("Failed to send contact emails:", error);
        throw error;
    }
};

export default resend;
