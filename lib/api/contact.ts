import { apiPost } from './client'

export type ContactPayload = {
  name: string
  email: string
  company?: string
  service?: string
  message: string
  /** Honeypot: real visitors never fill it. */
  website?: string
  /** Milliseconds the form was open; the server rejects instant submits. */
  elapsed: number
}

export const sendContact = (payload: ContactPayload) => apiPost('/api/contact.php', payload)
