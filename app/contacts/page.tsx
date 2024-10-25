"use client"

import { OnClick, Search, SearchComponentState, useSearch, value } from "next-hook-core"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Item } from "onecore"
import React, { useMemo } from "react"
import Pagination from "reactx-paging"
import { formatDateTime } from "ui-plus"
import { getDateFormat, inputSearch } from "uione"
import { Contact, ContactFilter, getContactService } from "./service"

interface ContactSearch extends SearchComponentState<Contact, ContactFilter> {
  statusList: Item[]
}
const contactFilter: ContactFilter = {
  id: "",
  name: "",
  phone: "",
  email: "",
  q: "",
}
const initialState: ContactSearch = {
  statusList: [],
  list: [],
  filter: contactFilter,
}
export default function ContactsForm() {
  const dateFormat = getDateFormat()
  const router = useRouter()
  const pathname = usePathname()
  const path = useMemo(() => {
    return pathname
  }, [])
  const refForm = React.useRef()
  const { state, resource, component, updateState, search, sort, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<
    Contact,
    ContactFilter,
    ContactSearch
  >(refForm, initialState, getContactService(), inputSearch())
  const edit = (e: OnClick, id: string) => {
    e.preventDefault()
    router.push(path + `/${id}`)
  }

  const { list } = state
  const filter = value(state.filter)
  return (
    <div className="view-container">
      <header>
        <h2>{resource.contacts}</h2>
        <div className="btn-group">
          {component.view !== "table" && <button type="button" id="btnTable" name="btnTable" className="btn-table" data-view="table" onClick={changeView} />}
          {component.view === "table" && (
            <button type="button" id="btnListView" name="btnListView" className="btn-list-view" data-view="listview" onClick={changeView} />
          )}
          <Link id="btnNew" className="btn-new" href={path + "/new"} />
        </div>
      </header>
      <div>
        <form id="contactsForm" name="contactsForm" noValidate={true} ref={refForm as any}>
          <section className="row search-group">
            <Search
              className="col s12 m6 search-input"
              size={component.pageSize}
              sizes={component.pageSizes}
              pageSizeChanged={pageSizeChanged}
              onChange={updateState}
              placeholder={resource.keyword}
              toggle={toggleFilter}
              value={filter.q || ""}
              search={search}
              clear={clearQ}
            />
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
              {resource.email}
              <input type="text" id="email" name="email" value={filter.email || ""} onChange={updateState} maxLength={255} placeholder={resource.email} />
            </label>
            <label className="col s12 m6">
              {resource.phone}
              <input type="text" id="phone" name="phone" value={filter.phone || ""} onChange={updateState} maxLength={255} placeholder={resource.phone} />
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
                    <th data-field="name">
                      <button type="button" id="sortName" onClick={sort}>
                        {resource.fullname}
                      </button>
                    </th>
                    <th data-field="email">
                      <button type="button" id="sortEmail" onClick={sort}>
                        {resource.email}
                      </button>
                    </th>
                    <th data-field="phone">
                      <button type="button" id="sortPhone" onClick={sort}>
                        {resource.phone}
                      </button>
                    </th>
                    <th data-field="country">
                      <button type="button" id="sortCountry" onClick={sort}>
                        {resource.country}
                      </button>
                    </th>
                    <th data-field="submittedAt">
                      <button type="button" id="sortSubmittedAt" onClick={sort}>
                        {resource.submitted_at}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list &&
                    list.length > 0 &&
                    list.map((contact, i) => {
                      return (
                        <tr key={i} onClick={(e) => edit(e, contact.id)}>
                          <td className="text-right">{(contact as any).sequenceNo}</td>
                          <td>
                            <a>{contact.name}</a>
                          </td>
                          <td>{contact.email}</td>
                          <td>{contact.phone}</td>
                          <td>{contact.country}</td>
                          <td>{formatDateTime(contact.submittedAt, dateFormat)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
          {component.view !== "table" && (
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((item, i) => {
                  return (
                    <li key={i} className="col s12 m6 l4 xl3" onClick={(e) => edit(e, item.id)}>
                      <section>
                        <div>
                          <h4>
                            <Link href={`${path}/${item.id}`}>{item.name}</Link>
                          </h4>
                          <p>{item.email}</p>
                        </div>
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
