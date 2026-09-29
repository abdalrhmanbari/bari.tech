export type Review = {
  id: string;
  name: string;
  /** Job title and/or company, e.g. "CEO, MAHAM". */
  role: string;
  /** Title of the project being reviewed (matches a project card title). */
  project: string;
  /** 1–5 stars. */
  rating: number;
  text: string;
  /** Language the client wrote the review in. */
  lang: "en" | "ar";
  /** ISO timestamp of when the review was submitted. */
  createdAt: string;
  /** Only approved reviews are shown on the site. */
  approved: boolean;
  /**
   * Admin-entered translation into the other language. The original `text`
   * and `role` are never changed; the site shows this to visitors browsing
   * in the other language, labelled as translated.
   */
  translation?: ReviewTranslation;
};

export type ReviewTranslation = { text: string; role: string };

/** The subset of a review that is sent to the public site. */
export type PublicReview = Pick<
  Review,
  "id" | "name" | "role" | "project" | "rating" | "text" | "lang" | "translation"
>;
