import { Attributes, Filter, Service, Tracking } from "onecore"

export interface ContactFilter extends Filter {
  id?: string
  name?: string
  country?: string
  company?: string
  jobTitle?: string
  email?: string
  phone?: string
}
export interface Contact extends Tracking {
  id: string
  name: string
  country: string
  company: string
  jobTitle: string
  email: string
  phone: string
  message: string
}
export interface ContactService extends Service<Contact, string, ContactFilter> {}

export const contactModel: Attributes = {
  id: {
    length: 40,
    required: true,
    key: true,
  },
  name: {
    length: 100,
    required: true,
    q: true,
  },
  title: {
    length: 20,
    q: true,
  },
  phone: {
    format: "phone",
    length: 14,
  },
  email: {
    length: 100,
    q: true,
  },
  submittedAt: {
    type: "datetime",
  },
  contactedBy: {
    length: 40,
  },
  contactedAt: {
    type: "datetime",
  },
}
