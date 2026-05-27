/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'shared-travels': {
    methods: ["GET","HEAD"],
    pattern: '/shared/:shareLinkId',
    tokens: [{"old":"/shared/:shareLinkId","type":0,"val":"shared","end":""},{"old":"/shared/:shareLinkId","type":1,"val":"shareLinkId","end":""}],
    types: placeholder as Registry['shared-travels']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'forgotten_password.create': {
    methods: ["GET","HEAD"],
    pattern: '/forgotten-password',
    tokens: [{"old":"/forgotten-password","type":0,"val":"forgotten-password","end":""}],
    types: placeholder as Registry['forgotten_password.create']['types'],
  },
  'forgotten_password.store': {
    methods: ["POST"],
    pattern: '/forgotten-password',
    tokens: [{"old":"/forgotten-password","type":0,"val":"forgotten-password","end":""}],
    types: placeholder as Registry['forgotten_password.store']['types'],
  },
  'password_reset.edit': {
    methods: ["GET","HEAD"],
    pattern: '/reset-password/:token',
    tokens: [{"old":"/reset-password/:token","type":0,"val":"reset-password","end":""},{"old":"/reset-password/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['password_reset.edit']['types'],
  },
  'password_reset.update': {
    methods: ["POST"],
    pattern: '/reset-password/:token',
    tokens: [{"old":"/reset-password/:token","type":0,"val":"reset-password","end":""},{"old":"/reset-password/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['password_reset.update']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'steps.create': {
    methods: ["POST"],
    pattern: '/steps',
    tokens: [{"old":"/steps","type":0,"val":"steps","end":""}],
    types: placeholder as Registry['steps.create']['types'],
  },
  'steps.update': {
    methods: ["PATCH"],
    pattern: '/steps/:id',
    tokens: [{"old":"/steps/:id","type":0,"val":"steps","end":""},{"old":"/steps/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['steps.update']['types'],
  },
  'steps.destroy': {
    methods: ["DELETE"],
    pattern: '/steps/:id',
    tokens: [{"old":"/steps/:id","type":0,"val":"steps","end":""},{"old":"/steps/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['steps.destroy']['types'],
  },
  'travels.create': {
    methods: ["POST"],
    pattern: '/travels',
    tokens: [{"old":"/travels","type":0,"val":"travels","end":""}],
    types: placeholder as Registry['travels.create']['types'],
  },
  'travels.index': {
    methods: ["GET","HEAD"],
    pattern: '/travels',
    tokens: [{"old":"/travels","type":0,"val":"travels","end":""}],
    types: placeholder as Registry['travels.index']['types'],
  },
  'travels.index_steps_travels': {
    methods: ["GET","HEAD"],
    pattern: '/travels/steps-travels',
    tokens: [{"old":"/travels/steps-travels","type":0,"val":"travels","end":""},{"old":"/travels/steps-travels","type":0,"val":"steps-travels","end":""}],
    types: placeholder as Registry['travels.index_steps_travels']['types'],
  },
  'travels.search': {
    methods: ["GET","HEAD"],
    pattern: '/travels/search',
    tokens: [{"old":"/travels/search","type":0,"val":"travels","end":""},{"old":"/travels/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['travels.search']['types'],
  },
  'session.create_share_link': {
    methods: ["GET","HEAD"],
    pattern: '/users/create-share-link',
    tokens: [{"old":"/users/create-share-link","type":0,"val":"users","end":""},{"old":"/users/create-share-link","type":0,"val":"create-share-link","end":""}],
    types: placeholder as Registry['session.create_share_link']['types'],
  },
  'session.update_theme': {
    methods: ["POST"],
    pattern: '/users/update-theme',
    tokens: [{"old":"/users/update-theme","type":0,"val":"users","end":""},{"old":"/users/update-theme","type":0,"val":"update-theme","end":""}],
    types: placeholder as Registry['session.update_theme']['types'],
  },
  'session.update_profile_picture': {
    methods: ["POST"],
    pattern: '/users/update-profile-picture',
    tokens: [{"old":"/users/update-profile-picture","type":0,"val":"users","end":""},{"old":"/users/update-profile-picture","type":0,"val":"update-profile-picture","end":""}],
    types: placeholder as Registry['session.update_profile_picture']['types'],
  },
  'travels.index_shared': {
    methods: ["GET","HEAD"],
    pattern: '/travels-shared/:shareLinkId',
    tokens: [{"old":"/travels-shared/:shareLinkId","type":0,"val":"travels-shared","end":""},{"old":"/travels-shared/:shareLinkId","type":1,"val":"shareLinkId","end":""}],
    types: placeholder as Registry['travels.index_shared']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
