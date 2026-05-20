/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'shared-travels': {
    methods: ["GET","HEAD"]
    pattern: '/shared/:shareLinkId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shareLinkId: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'steps.create': {
    methods: ["POST"]
    pattern: '/steps'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/step').createStepValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/step').createStepValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['create']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'steps.update': {
    methods: ["PATCH"]
    pattern: '/steps/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/step').updateStepValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/step').updateStepValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'steps.destroy': {
    methods: ["DELETE"]
    pattern: '/steps/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['destroy']>>>
    }
  }
  'travels.create': {
    methods: ["POST"]
    pattern: '/travels'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/travel').createTravelValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/travel').createTravelValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/travels_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/travels_controller').default['create']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'travels.index': {
    methods: ["GET","HEAD"]
    pattern: '/travels'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/travels_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/travels_controller').default['index']>>>
    }
  }
  'session.create_share_link': {
    methods: ["GET","HEAD"]
    pattern: '/create-share-link'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['createShareLink']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['createShareLink']>>>
    }
  }
  'travels.index_shared': {
    methods: ["GET","HEAD"]
    pattern: '/travels-shared/:shareLinkId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shareLinkId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/travels_controller').default['indexShared']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/travels_controller').default['indexShared']>>>
    }
  }
}
