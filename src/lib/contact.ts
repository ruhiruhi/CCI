export const CONTACT_ROLES = [
  "Student / young filmmaker",
  "Volunteer",
  "Educator / school",
  "NGO / partner",
  "CSR / funder",
  "Just curious",
] as const;

export type ContactRole = (typeof CONTACT_ROLES)[number];

export type ContactSubmission = {
  name: string;
  email: string;
  role: ContactRole;
  message: string;
};

export function isContactRole(value: string): value is ContactRole {
  return (CONTACT_ROLES as readonly string[]).includes(value);
}
