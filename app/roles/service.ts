import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { RoleClient, RoleService } from "./(role)"

export * from "./(role)"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  role_url: string
  privilege_url: string
}
class ApplicationContext {
  roleService?: RoleClient
  constructor() {
    this.getConfig = this.getConfig.bind(this)
    this.getRoleService = this.getRoleService.bind(this)
  }
  getConfig(): Config {
    return storage.config()
  }
  getRoleService(): RoleService {
    if (!this.roleService) {
      const c = this.getConfig()
      this.roleService = new RoleClient(httpRequest, c.role_url, c.privilege_url)
    }
    return this.roleService
  }
}

export const context = new ApplicationContext()
export function getRoleService(): RoleService {
  return context.getRoleService()
}
