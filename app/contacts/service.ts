import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { ContactClient, ContactService } from "./(contact)"

export * from "./(contact)"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  contact_url: string
}
class ApplicationContext {
  contactService?: ContactService
  constructor() {
    this.getConfig = this.getConfig.bind(this)
    this.getContactService = this.getContactService.bind(this)
  }
  getConfig(): Config {
    return storage.config()
  }
  getContactService(): ContactService {
    if (!this.contactService) {
      const c = this.getConfig()
      this.contactService = new ContactClient(httpRequest, c.contact_url)
    }
    return this.contactService
  }
}

export const context = new ApplicationContext()
export function getContactService(): ContactService {
  return context.getContactService()
}
