import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'shared-travels': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'forgotten_password.create': { paramsTuple?: []; params?: {} }
    'forgotten_password.store': { paramsTuple?: []; params?: {} }
    'password_reset.edit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'password_reset.update': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'steps.create': { paramsTuple?: []; params?: {} }
    'steps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travels.create': { paramsTuple?: []; params?: {} }
    'travels.index': { paramsTuple?: []; params?: {} }
    'travels.index_steps_travels': { paramsTuple?: []; params?: {} }
    'travels.search': { paramsTuple?: []; params?: {} }
    'session.create_share_link': { paramsTuple?: []; params?: {} }
    'session.update_theme': { paramsTuple?: []; params?: {} }
    'session.update_profile_picture': { paramsTuple?: []; params?: {} }
    'travels.index_shared': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'shared-travels': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'forgotten_password.create': { paramsTuple?: []; params?: {} }
    'password_reset.edit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'travels.index': { paramsTuple?: []; params?: {} }
    'travels.index_steps_travels': { paramsTuple?: []; params?: {} }
    'travels.search': { paramsTuple?: []; params?: {} }
    'session.create_share_link': { paramsTuple?: []; params?: {} }
    'travels.index_shared': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'shared-travels': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'forgotten_password.create': { paramsTuple?: []; params?: {} }
    'password_reset.edit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'travels.index': { paramsTuple?: []; params?: {} }
    'travels.index_steps_travels': { paramsTuple?: []; params?: {} }
    'travels.search': { paramsTuple?: []; params?: {} }
    'session.create_share_link': { paramsTuple?: []; params?: {} }
    'travels.index_shared': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'forgotten_password.store': { paramsTuple?: []; params?: {} }
    'password_reset.update': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'steps.create': { paramsTuple?: []; params?: {} }
    'travels.create': { paramsTuple?: []; params?: {} }
    'session.update_theme': { paramsTuple?: []; params?: {} }
    'session.update_profile_picture': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'steps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'steps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}