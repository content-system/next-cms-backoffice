import { Attributes, Filter, Service, Tracking } from "onecore"

export interface Job extends Tracking {
  id: string
  title: string
  description: string
  skill?: string[]
  publishedAt: Date
  expiredAt: Date | null
  quantity: number
  applicantCount: number
  requirements: string
  benefit: string
  companyId: string
  status: string
}
export interface JobFilter extends Filter {
  id?: string
  title?: string
  description?: string
  skill?: string[]
  publishedAt?: Date
  expiredAt?: Date
  quantity?: number
  applicantCount?: number
  requirements?: string
  benefit?: string
  companyId?: string
}
export interface JobService extends Service<Job, string, JobFilter> {
  // getJobs(id: string): Promise<Job[]>;
}
export const jobModel: Attributes = {
  id: {
    length: 40,
    required: true,
    key: true,
  },
  title: {
    length: 120,
    q: true,
  },
  description: {
    length: 1000,
    q: true,
  },
  benefit: {
    length: 1000,
    q: true,
  },
  requirements: {
    length: 1000,
    q: true,
  },
  publishedAt: {
    type: "datetime",
  },
  expiredAt: {
    type: "datetime",
  },
  skills: {
    type: "primitives",
  },
  quantity: {
    type: "number",
  },
  applicantCount: {
    type: "number",
  },
}
