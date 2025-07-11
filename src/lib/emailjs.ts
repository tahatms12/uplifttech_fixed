import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");

interface EmailParams {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
}

interface CareerApplicationParams extends EmailParams {
  position: string;
  resume: File;
  portfolio?: string;
}

export const sendContactEmail = async (params: EmailParams) => {
  try {
    const templateParams = {
      to_name: "Uplift Technologies",
      from_name: params.name,
      from_email: params.email,
      phone: params.phone || "Not provided",
      company: params.company || "Not provided",
      service_interest: params.service || "Not specified",
      message: params.message,
      to_email: "business@uplift-technologies.com"
    };

    const result = await emailjs.send(
      "zoho", // Service ID for your Zoho email service
      "contact_form", // Template ID for contact form
      templateParams
    );

    return result;
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
};

export const sendCareerApplication = async (params: CareerApplicationParams) => {
  try {
    const templateParams = {
      to_name: "Uplift Technologies HR",
      from_name: params.name,
      from_email: params.email,
      phone: params.phone || "Not provided",
      position: params.position,
      portfolio: params.portfolio || "Not provided",
      message: params.message,
      resume_url: params.resume,
      to_email: "hr@uplift-technologies.com"
    };

    const result = await emailjs.send(
      "zoho", // Service ID for your Zoho email service
      "career_application", // Template ID for career applications
      templateParams
    );

    return result;
  } catch (error) {
    console.error("Error sending career application:", error);
    throw error;
  }
};