"use client"

import femaleIcon from "@assets/images/female.png"
import maleIcon from "@assets/images/male.png"
import { checked, OnClick, Search, SearchComponentState, useSearch, value } from "next-hook-core"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Item } from "onecore"
import React, { useMemo } from "react"
import Pagination from "reactx-paging"
import { inputSearch } from "uione"
import { getUserService, User, UserFilter } from "./service"

interface UserSearch extends SearchComponentState<User, UserFilter> {
  statusList: Item[]
}
const userFilter: UserFilter = {
  userId: "",
  username: "",
  displayName: "",
  email: "",
  status: [],
  q: "",
}
const initialState: UserSearch = {
  statusList: [],
  list: [],
  filter: userFilter,
}
export default function UsersForm() {
  const router = useRouter()
  const pathname = usePathname()
  const path = useMemo(() => {
    return pathname
  }, [])
  const refForm = React.useRef()
  const { state, resource, component, updateState, search, sort, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<
    User,
    UserFilter,
    UserSearch
  >(refForm, initialState, getUserService(), inputSearch())
  const edit = (e: OnClick, id: string) => {
    e.preventDefault()
    router.push(path + `/${id}`)
  }

  const { list } = state
  const filter = value(state.filter)
  return (
    <div className="view-container">
      <header>
        <h2>{resource.users}</h2>
        <div className="btn-group">
          {component.view !== "table" && <button type="button" id="btnTable" name="btnTable" className="btn-table" data-view="table" onClick={changeView} />}
          {component.view === "table" && (
            <button type="button" id="btnListView" name="btnListView" className="btn-list-view" data-view="listview" onClick={changeView} />
          )}
          <Link id="btnNew" className="btn-new" href={path + "/new"} />
        </div>
      </header>
      <div>
        <form id="usersForm" name="usersForm" noValidate={true} ref={refForm as any}>
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
            <label className="col s12 m4 l4">
              {resource.username}
              <input
                type="text"
                id="username"
                name="username"
                value={filter.username || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.username}
              />
            </label>
            <label className="col s12 m4 l4">
              {resource.display_name}
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={filter.displayName || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.display_name}
              />
            </label>
            <label className="col s12 m4 l4 checkbox-section">
              {resource.status}
              <section className="checkbox-group">
                <label>
                  <input type="checkbox" id="A" name="status" value="A" checked={checked(filter.status, "A")} onChange={updateState} />
                  {resource.active}
                </label>
                <label>
                  <input type="checkbox" id="I" name="status" value="I" checked={checked(filter.status, "I")} onChange={updateState} />
                  {resource.inactive}
                </label>
              </section>
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
                    <th data-field="userId">
                      <button type="button" id="sortUserId" onClick={sort}>
                        {resource.user_id}
                      </button>
                    </th>
                    <th data-field="username">
                      <button type="button" id="sortUserName" onClick={sort}>
                        {resource.username}
                      </button>
                    </th>
                    <th data-field="email">
                      <button type="button" id="sortEmail" onClick={sort}>
                        {resource.email}
                      </button>
                    </th>
                    <th data-field="displayname">
                      <button type="button" id="sortDisplayName" onClick={sort}>
                        {resource.display_name}
                      </button>
                    </th>
                    <th data-field="status">
                      <button type="button" id="sortStatus" onClick={sort}>
                        {resource.status}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list &&
                    list.length > 0 &&
                    list.map((user, i) => {
                      return (
                        <tr key={i} onClick={(e) => edit(e, user.userId)}>
                          <td className="text-right">{(user as any).sequenceNo}</td>
                          <td>{user.userId}</td>
                          <td>
                            <a>{user.username}</a>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.displayName}</td>
                          <td>{user.status}</td>
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
                list.map((user, i) => {
                  return (
                    <li key={i} className="col s12 m6 l4 xl3" onClick={(e) => edit(e, user.userId)}>
                      <section>
                        <img
                          src={user.imageURL && user.imageURL.length > 0 ? user.imageURL : user.gender === "F" ? femaleIcon.src : maleIcon.src}
                          alt="user"
                          className="round-border"
                        />
                        <div>
                          <h4 className={user.status === "I" ? "inactive" : ""}>
                            <a>{user.displayName}</a>
                          </h4>
                          <p>{user.email}</p>
                        </div>
                        <button className="btn-detail" />
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
