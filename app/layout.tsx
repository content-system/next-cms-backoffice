"use client"

import "@assets/css/globals.css"

import LayoutPage from "@core/layout"
import { resources as locales } from "@core/resources"
import * as csv from "csvtojson"
import { currency, locale } from "locale-service"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { phonecodes } from "phonecodes"
import { alertError, confirm, resources as uiplusResources } from "ui-alert"
import { loading } from "ui-loading"
import { parseDate, resources as uiresources, UIService } from "ui-plus"
import { toast } from "ui-toast"
import { storage } from "uione"
import { resources as vresources } from "validation-core"
import { DefaultCsvService, resources } from "web-clients"
import { config } from "../config"

let isInit = false
export function init() {
  if (isInit) {
    return
  }
  isInit = true
  storage.setConfig(config)
  resources.csv = new DefaultCsvService(csv)
  resources.config = {
    list: "list",
  }
  storage.globalNavigator = true
  storage.navigator = global.navigator
  if (storage.home == null || storage.home === undefined) {
    storage.home = "/"
  }
  storage.home = "/"
  // storage.token = getToken;
  storage.moment = true
  storage.setResources(locales)
  storage.setLoadingService(loading)
  storage.setUIService(new UIService())
  storage.currency = currency
  storage.locale = locale
  storage.alert = alertError
  storage.confirm = confirm
  storage.message = toast

  const resource = storage.resource()
  vresources.phonecodes = phonecodes
  uiresources.date = parseDate
  uiresources.currency = currency
  uiresources.resource = resource

  const res = storage.getResource()

  uiplusResources.confirmHeader = res.confirm
  uiplusResources.leftText = res.no
  uiplusResources.rightText = res.yes
  uiplusResources.errorHeader = res.error
  uiplusResources.warningHeader = res.warning
  uiplusResources.infoHeader = res.info
  uiplusResources.successHeader = res.success
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hasLayout = !pathname.endsWith("/signin")
  init()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="../public/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site created using create-react-app" />
        <link rel="apple-touch-icon" href="../public/logo192.png" />
        <title>Next App</title>
      </head>
      <body id="sysBody" className="full-header top-menu">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="sysToast" className="toast-message alert-success"></div>
        <div id="sysLoading" className="loader-wrapper" style={{ display: "none" }}>
          <div className="loader-sign">
            <div className="loader"></div>
          </div>
        </div>
        <div id="sysAlert" className="alert-wrapper">
          <div className="alert">
            <div>
              <div id="sysIcon" className="alert-icon"></div>
              <h4 id="sysMessageHeader"></h4>
              <p id="sysMessage"></p>
            </div>
            <footer>
              <button type="button" className="btn-cancel" id="sysNo" name="btnCancel" />
              <button type="submit" className="btn-accept" id="sysYes" name="btnAccept" />
            </footer>
          </div>
        </div>
        <Script src="/static/script.js"></Script>
        {hasLayout && <LayoutPage>{children}</LayoutPage>}
        {!hasLayout && <>{children}</>}
      </body>
    </html>
  )
}
