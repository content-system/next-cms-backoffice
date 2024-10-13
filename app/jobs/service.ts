import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { JobClient, JobService } from "./(job)"

export * from "./(job)"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  job_url: string
}
class ApplicationContext {
  jobService?: JobClient
  constructor() {
    this.getConfig = this.getConfig.bind(this)
    this.getJobService = this.getJobService.bind(this)
  }
  getConfig(): Config {
    return storage.config()
  }
  getJobService(): JobService {
    if (!this.jobService) {
      const c = this.getConfig()
      this.jobService = new JobClient(httpRequest, c.job_url)
    }
    return this.jobService
  }
}

export const context = new ApplicationContext()
export function getJobService(): JobService {
  return context.getJobService()
}
