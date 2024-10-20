"use client"

import { isSuccessful } from "next-hook-core"
import { useParams, useRouter } from "next/navigation"
import { Result } from "onecore"
import { useEffect, useRef, useState } from "react"
import { alertError, alertSuccess, confirm } from "ui-alert"
import { hideLoading, showLoading } from "ui-loading"
import { emailOnBlur, formatPhone, phoneOnBlur, registerEvents, requiredOnBlur, showFormError, validateForm } from "ui-plus"
import { getLocale, handleError, initForm, useResource } from "uione"
import { Contact } from "../(contact)"
import { getContactService } from "../service"

interface InternalState {
  contact: Contact
}
const initialState: InternalState = {
  contact: {} as Contact,
}

export default function ContactUs() {
  const resource = useResource()
  const refForm = useRef()
  const router = useRouter()
  const { id } = useParams()
  useEffect(() => {
    initForm(refForm?.current, registerEvents)
  }, [])
  useEffect(() => {
    if (id) {
      getContactService()
        .load(id as string)
        .then((contact) => {
          if (contact) {
            setState({ contact })
          }
        })
        .catch(handleError)
    }
  }, [id])
  const [state, setState] = useState<InternalState>(initialState)
  const validate = (contact: Contact): boolean => {
    const valid = validateForm(refForm?.current, getLocale())
    return valid
  }
  const contact = state.contact

  const back = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    router.back()
  }

  const save = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault()
    const valid = validate(contact)
    if (valid) {
      const service = getContactService()
      confirm(resource.msg_confirm_save, () => {
        showLoading()
        service
          .update(contact)
          .then((res) => afterSaved(res))
          .catch(handleError)
          .finally(hideLoading)
      })
    }
  }
  const afterSaved = (res: Result<Contact>) => {
    if (Array.isArray(res)) {
      showFormError(refForm?.current, res)
    } else if (isSuccessful(res)) {
      alertSuccess(resource.msg_save_success)
    } else {
      alertError(resource.error_conflict)
    }
  }
  return (
    <div className="view-container">
      <form id="contactForm" name="contactForm" model-name="contact" ref={refForm as any}>
        <header>
          <h2>{resource.contact}</h2>
          <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={back} />
        </header>
        <div className="row">
          <label className="col s12 m6">
            {resource.fullname}
            <input
              type="text"
              id="name"
              name="name"
              value={contact.name || ""}
              onChange={(e) => {
                contact.name = e.target.value
                setState({ contact })
              }}
              onBlur={requiredOnBlur}
              maxLength={100}
              required={true}
              placeholder={resource.fullname}
            />
          </label>
          <label className="col s12 m6">
            {resource.country}
            <input
              type="text"
              id="country"
              name="country"
              value={contact.country || ""}
              onChange={(e) => {
                contact.country = e.target.value
                setState({ contact })
              }}
              onBlur={requiredOnBlur}
              maxLength={100}
              required={true}
              placeholder={resource.country}
            />
          </label>
          <label className="col s12 m6">
            {resource.company}
            <input
              type="text"
              id="company"
              name="company"
              value={contact.company || ""}
              onChange={(e) => {
                contact.company = e.target.value
                setState({ contact })
              }}
              onBlur={requiredOnBlur}
              maxLength={100}
              required={true}
              placeholder={resource.company}
            />
          </label>
          <label className="col s12 m6">
            {resource.job_title}
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              data-type="jobTitle"
              value={contact.jobTitle || ""}
              onChange={(e) => {
                contact.jobTitle = e.target.value
                setState({ contact })
              }}
              onBlur={requiredOnBlur}
              maxLength={100}
              placeholder={resource.job_title}
            />
          </label>
          <label className="col s12 m6">
            {resource.email}
            <input
              type="text"
              id="email"
              name="email"
              data-type="email"
              value={contact.email || ""}
              onChange={(e) => {
                contact.email = e.target.value
                setState({ contact })
              }}
              onBlur={emailOnBlur}
              required={true}
              maxLength={120}
              placeholder={resource.email}
            />
          </label>
          <label className="col s12 m6">
            {resource.phone}
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formatPhone(contact.phone) || ""}
              onChange={(e) => {
                contact.phone = e.target.value
                setState({ contact })
              }}
              onBlur={phoneOnBlur}
              required={true}
              maxLength={17}
              placeholder={resource.phone}
            />
          </label>
          <label className="col s12 m12">
            {resource.message}
            <textarea
              id="message"
              name="message"
              value={contact.message}
              onChange={(e) => {
                contact.message = e.target.value
                setState({ contact })
              }}
              onBlur={requiredOnBlur}
              maxLength={400}
              placeholder={resource.message}
            />
          </label>
        </div>
        <footer>
          <button type="submit" id="btnSave" name="btnSave" onClick={save}>
            {resource.save}
          </button>
        </footer>
      </form>
    </div>
  )
}
