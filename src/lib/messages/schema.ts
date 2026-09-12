export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  /** ISO timestamp of when the message was submitted. */
  createdAt: string;
  read: boolean;
};
