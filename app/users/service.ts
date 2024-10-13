import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { UserClient, UserService } from "./(user)"
import { MasterDataClient, MasterDataService } from "./master-data"

export * from "./(user)"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  user_url: string
}
class ApplicationContext {
  userService?: UserService
  masterDataService?: MasterDataService
  constructor() {
    this.getConfig = this.getConfig.bind(this)
    this.getUserService = this.getUserService.bind(this)
    this.getMasterDataService = this.getMasterDataService.bind(this)
  }
  getConfig(): Config {
    return storage.config()
  }
  getUserService(): UserService {
    if (!this.userService) {
      const c = this.getConfig()
      this.userService = new UserClient(httpRequest, c.user_url)
    }
    return this.userService
  }
  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient()
    }
    return this.masterDataService
  }
}

export const context = new ApplicationContext()
export function getUserService(): UserService {
  return context.getUserService()
}
export function getMasterData(): MasterDataService {
  return context.getMasterDataService()
}
