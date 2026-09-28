export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  /** Which form it came from. Missing on messages saved before quotes existed. */
  kind?: "contact" | "quote";
  /** ISO timestamp of when the message was submitted. */
  createdAt: string;
  read: boolean;
};
