"use client"

import { OnClick, PageSizeSelect, SearchComponentState, useSearch, value } from "next-hook-core"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Item } from "onecore"
import * as React from "react"
import Pagination from "reactx-paging"
import { addDays, datetimeToString, formatDateTime } from "ui-plus"
import { getDateFormat, inputSearch } from "uione"
import { Article, ArticleFilter, getArticleService } from "./service"

interface ArticleSearch extends SearchComponentState<Article, ArticleFilter> {
  statusList: Item[]
}
const articleFilter: ArticleFilter = {
  q: "",
  title: "",
  description: "",
  publishedAt: {
    max: new Date(),
    min: addDays(new Date(), -60),
  },
}
const articleSearch: ArticleSearch = {
  statusList: [],
  list: [],
  filter: articleFilter,
}
export default function Articles() {
  const dateFormat = getDateFormat()
  const router = useRouter()
  const pathname = usePathname()
  const path = React.useMemo(() => {
    return pathname
  }, [])
  const refForm = React.useRef()
  const { state, resource, component, updateState, search, sort, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<
    Article,
    ArticleFilter,
    ArticleSearch
  >(refForm, articleSearch, getArticleService(), inputSearch())

  const edit = (e: OnClick, id: string) => {
    e.preventDefault()
    router.push(path + `/${id}`)
  }
  const filter = value(state.filter)
  return (
    <div className="view-container">
      <header>
        <h2>{resource.articles}</h2>
        <div className="btn-group">
          {component.view !== "table" && <button type="button" id="btnTable" name="btnTable" className="btn-table" data-view="table" onClick={changeView} />}
          {component.view === "table" && (
            <button type="button" id="btnListView" name="btnListView" className="btn-list-view" data-view="listview" onClick={changeView} />
          )}
          <Link id="btnNew" className="btn-new" href="new" />
        </div>
      </header>
      <div>
        <form id="articlesForm" name="articlesForm" noValidate={true} ref={refForm as any}>
          <section className="row search-group">
            <label className="col s12 m6 search-input">
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              <input type="text" id="q" name="q" value={filter.q || ""} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
              <button type="button" hidden={!filter.q} className="btn-remove-text" onClick={clearQ} />
              <button type="button" className="btn-filter" onClick={toggleFilter} />
              <button type="submit" className="btn-search" onClick={search} />
            </label>
            <Pagination
              className="col s12 m6"
              total={component.total}
              size={component.pageSize}
              max={component.pageMaxSize}
              page={component.pageIndex}
              onChange={pageChanged}
            />
          </section>
          <section className="row search-group inline" hidden={component.hideFilter}>
            <label className="col s12 m6">
              {resource.published_at_from}
              <input
                type="datetime-local"
                step=".010"
                id="publishedAt_min"
                name="publishedAt_min"
                data-field="publishedAt.min"
                value={datetimeToString(filter.publishedAt?.min)}
                onChange={updateState}
              />
            </label>
            <label className="col s12 m6">
              {resource.published_at_to}
              <input
                type="datetime-local"
                step=".010"
                id="publishedAt_max"
                name="publishedAt_max"
                data-field="publishedAt.max"
                value={datetimeToString(filter.publishedAt?.max)}
                onChange={updateState}
              />
            </label>
          </section>
        </form>
        <form className="list-result">
          {component.view === "table" && (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field="id">
                      <button type="button" id="sortId" onClick={sort}>
                        {resource.id}
                      </button>
                    </th>
                    <th data-field="title">
                      <button type="button" id="sortTitle" onClick={sort}>
                        {resource.title}
                      </button>
                    </th>
                    <th data-field="publishedAt" className="datetime">
                      <button type="button" id="sortPublishedAt" onClick={sort}>
                        {resource.published_at}
                      </button>
                    </th>
                    <th data-field="description">
                      <button type="button" id="sortDescription" onClick={sort}>
                        {resource.description}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.list &&
                    state.list.length > 0 &&
                    state.list.map((item, i) => {
                      return (
                        <tr key={i} onClick={(e) => edit(e, item.id)}>
                          <td className="text-right">{(item as any).sequenceNo}</td>
                          <td>{item.id}</td>
                          <td>
                            <a>{item.title}</a>
                          </td>
                          <td>{formatDateTime(item.publishedAt, dateFormat)}</td>
                          <td>{item.description}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
          {component.view !== "table" && (
            <ul className="row list-view">
              {state.list &&
                state.list.length > 0 &&
                state.list.map((item, i) => {
                  return (
                    <li key={i} className="col s12 m6 l4 xl3 card" onClick={(e) => edit(e, item.id)}>
                      <section>
                        <div className="cover" style={{ backgroundImage: `url('${item.thumbnail}')` }}></div>
                        <Link href={`${path}/${item.id}`}>{item.title}</Link>
                        <p>{formatDateTime(item.publishedAt, dateFormat)}</p>
                        <p>{item.description}</p>
                      </section>
                    </li>
                  )
                })}
            </ul>
          )}
        </form>
      </div>
    </div>
  )
}
