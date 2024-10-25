"use client"

import { createModel, EditComponentParam, useEdit } from "next-hook-core"
import { Item } from "onecore"
import * as React from "react"
import { inputEdit, requiredOnBlur, Status } from "uione"
import { getJobService, Job } from "../service"

interface InternalState {
  job: Job
  titleList: Item[]
  positionList: Item[]
}

const createJob = (): Job => {
  const job = createModel<Job>()
  return job
}

const initialState: InternalState = {
  job: {} as Job,
  titleList: [],
  positionList: [],
}

const param: EditComponentParam<Job, string, InternalState> = {
  createModel: createJob,
}

export default function JobForm() {
  const refForm = React.useRef()
  const { resource, state, setState, updateState, flag, save, updatePhoneState, back } = useEdit<Job, string, InternalState>(
    refForm,
    initialState,
    getJobService(),
    inputEdit(),
    param,
  )
  const job = state.job
  return (
    <div className="view-container">
      <form id="jobForm" name="jobForm" model-name="job" ref={refForm as any}>
        <header>
          <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={back} />
          <h2>
            {flag.newMode ? resource.create : resource.edit} {resource.job}
          </h2>
        </header>
        <div className="row">
          <label className="col s12 m6">
            {resource.id}
            <input
              type="text"
              id="id"
              name="id"
              value={job.id || ""}
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
              value={job.title || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={300}
              required={true}
              placeholder={resource.display_name}
            />
          </label>
          {/*
          <label className="col s12 m6">
            {resource.quantity}
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={job.quantity || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              min={1}
              maxLength={300}
              required={true}
              placeholder={resource.quantity}
            />
          </label> */}
          <label className="col s12 m6 flying">
            {resource.description}
            <input
              type="text"
              id="description"
              name="description"
              data-type="description"
              value={job.description || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={2000}
              placeholder={resource.description}
            />
          </label>
          <label className="col s12 m6">
            {resource.requirements}
            <input
              type="text"
              id="requirements"
              name="requirements"
              value={job.requirements || ""}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={2000}
              required={true}
              placeholder={resource.requirements}
            />
          </label>
          <div className="col s12 m6 radio-section">
            {resource.status}
            <div className="radio-group">
              <label>
                <input type="radio" id="active" name="status" onChange={updateState} value={Status.Active} checked={job.status === Status.Active} />
                {resource.yes}
              </label>
              <label>
                <input type="radio" id="inactive" name="status" onChange={updateState} value={Status.Inactive} checked={job.status === Status.Inactive} />
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
