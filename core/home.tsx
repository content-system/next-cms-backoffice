"use client"

import { useEffect, useState } from "react"
import { Groups, Item } from "reactx-groups"
import { getPrivileges, StringMap, useResource } from "uione"

export default function HomePage() {
  const [resource, setResource] = useState<StringMap>()
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    setResource(useResource())
    let groups = getPrivileges()
    setItems(groups)
  }, [])
  /*
  useEffect(() => {
    const v = (router.query.q as string) || ""
    setShownItems(buildShownItems(v, items))
  }, [items])
*/
  return (
    <Groups
      title={resource?.home}
      groups={items}
      resource={resource}
      className="view-container menu"
      groupClass="row group hr-height-1"
      headerClass="col s12 m12"
      subClass="col s6 m6 l3 xl2 group-span"
    />
  )
}
