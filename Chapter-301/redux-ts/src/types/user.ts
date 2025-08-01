export type Gender = 0 | 1;
export interface User {
  uid: number;
  email: string;
  name: string;
  gender: Gender;
  language?: string;
  is_admin: boolean;
  avatar_updated_at: number;
  create_by: string;
  webhook_url?: string;
  is_bot?: boolean;
  log_id?: number;
  widget_id?: string;
  msg_smtp_notify_enable?: boolean;
}
export type ContactStatus = "added" | "blocked" | "";
export interface Contact extends User {
  status: ContactStatus;
}
