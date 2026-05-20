import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'shared-travels': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'steps.create': { paramsTuple?: []; params?: {} }
    'steps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'travels.create': { paramsTuple?: []; params?: {} }
    'travels.index': { paramsTuple?: []; params?: {} }
    'session.create_share_link': { paramsTuple?: []; params?: {} }
    'travels.index_shared': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'shared-travels': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'travels.index': { paramsTuple?: []; params?: {} }
    'session.create_share_link': { paramsTuple?: []; params?: {} }
    'travels.index_shared': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'shared-travels': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'travels.index': { paramsTuple?: []; params?: {} }
    'session.create_share_link': { paramsTuple?: []; params?: {} }
    'travels.index_shared': { paramsTuple: [ParamValue]; params: {'shareLinkId': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'steps.create': { paramsTuple?: []; params?: {} }
    'travels.create': { paramsTuple?: []; params?: {} }
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