import { Request, Response } from "express";
import { sendContactEmail } from "../utils/mailer";

// POST /api/contact
export const handleContactSubmit = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject = "General Inquiry", message } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    if (!email || !email.trim()) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    if (!message || !message.trim()) {
      res.status(400).json({ message: "Message is required" });
      return;
    }

    // Call mailer to send email to studio admin & confirmation to sender
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
    });

    if (result.success) {
      res.json({
        success: true,
        message: "Thank you! Your message has been delivered to our studio team. We will get back to you within 24 hours.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || "Failed to dispatch email via SMTP. Please try again later.",
      });
    }
  } catch (error: any) {
    console.error("[CONTACT CONTROLLER ERROR]:", error.message);
    res.status(500).json({
      success: false,
      message: `Failed to deliver message via SMTP: ${error.message}`,
    });
  }
};
