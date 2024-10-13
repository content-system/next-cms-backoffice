import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { ArticleClient, ArticleService } from "./(article)"

export * from "./(article)"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  article_url: string
}
class ApplicationContext {
  articleService?: ArticleClient
  constructor() {
    this.getConfig = this.getConfig.bind(this)
    this.getArticleService = this.getArticleService.bind(this)
  }
  getConfig(): Config {
    return storage.config()
  }
  getArticleService(): ArticleService {
    if (!this.articleService) {
      const c = this.getConfig()
      this.articleService = new ArticleClient(httpRequest, c.article_url)
    }
    return this.articleService
  }
}

export const context = new ApplicationContext()
export function getArticleService(): ArticleService {
  return context.getArticleService()
}
