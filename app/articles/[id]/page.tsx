"use client"

import { createModel, EditComponentParam, useEdit } from "next-hook-core"
import * as React from "react"
import { inputEdit, requiredOnBlur, Status } from "uione"
import { Article, getArticleService } from "../service"

interface InternalState {
  article: Article
}

const createArticle = (): Article => {
  const article = createModel<Article>()
  return article
}

const initialState: InternalState = {
  article: {} as Article,
}

const param: EditComponentParam<Article, string, InternalState> = {
  createModel: createArticle,
}

export default function ArticleForm() {
  const refForm = React.useRef()
  const { resource, state, updateState, flag, save, back } = useEdit<Article, string, InternalState>(
    refForm,
    initialState,
    getArticleService(),
    inputEdit(),
    param,
  )
  const article = state.article
  return (
    <div className="view-container">
      <form id="articleForm" name="articleForm" model-name="article" ref={refForm as any}>
        <header>
          <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={back} />
          <h2>
            {flag.newMode ? resource.create : resource.edit} {resource.article}
          </h2>
        </header>
        <div className="row">
          <label className="col s12 m6">
            {resource.id}
            <input
              type="text"
              id="id"
              name="id"
              value={article.id || ""}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={40}
              required={true}
              placeholder={resource.id}
            />
          </label>
          <label className="col s12 m6">
            {resource.title}
            <input
              type="text"
              id="title"
              name="title"
              value={article.title || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={255}
              required={true}
              placeholder={resource.display_name}
            />
          </label>
          <label className="col s12 m6 flying">
            {resource.description}
            <input
              type="text"
              id="description"
              name="description"
              data-type="description"
              value={article.description || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={1000}
              placeholder={resource.description}
            />
          </label>
          <label className="col s12 m6">
            {resource.content}
            <input
              type="text"
              id="content"
              name="content"
              value={article.content || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={5000}
              required={true}
              placeholder={resource.content}
            />
          </label>
          <div className="col s12 m6 radio-section">
            {resource.status}
            <div className="radio-group">
              <label>
                <input type="radio" id="active" name="status" onChange={updateState} value={Status.Active} checked={article.status === Status.Active} />
                {resource.yes}
              </label>
              <label>
                <input type="radio" id="inactive" name="status" onChange={updateState} value={Status.Inactive} checked={article.status === Status.Inactive} />
                {resource.no}
              </label>
            </div>
          </div>
        </div>
        <footer>
          {!flag.readOnly && (
            <button type="submit" id="btnSave" name="btnSave" onClick={save}>
              {resource.save}
            </button>
          )}
        </footer>
      </form>
    </div>
  )
}
