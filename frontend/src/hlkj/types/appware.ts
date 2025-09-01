// AppWare 相关类型定义
export interface AppWareBase {
  name: string
  remark?: string | null
  sort_order: number
  status: number
  is_active: boolean
  view_count: number
}

export interface AppWareCreate extends AppWareBase {}

export interface AppWareUpdate {
  name?: string | null
  remark?: string | null
  sort_order?: number | null
  status?: number | null
  is_active?: boolean | null
  view_count?: number | null
}

export interface AppWarePublic extends AppWareBase {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  version: number
}

export interface AppWaresPublic {
  data: AppWarePublic[]
  count: number
}

// AppWare Service API 请求/响应类型
export interface AppWaresReadAppWaresData {
  skip?: number
  limit?: number
  status?: number | null
  is_active?: boolean | null
}

export interface AppWaresReadMyAppWaresData {
  skip?: number
  limit?: number
  status?: number | null
  is_active?: boolean | null
}

export interface AppWaresReadPopularAppWaresData {
  limit?: number
}

export interface AppWaresReadAppWareData {
  appware_id: number
}

export interface AppWaresCreateAppWareData {
  requestBody: AppWareCreate
}

export interface AppWaresUpdateAppWareData {
  appware_id: number
  requestBody: AppWareUpdate
}

export interface AppWaresDeleteAppWareData {
  appware_id: number
}

export interface AppWaresReadAllAppWaresAdminData {
  skip?: number
  limit?: number
  status?: number | null
  is_active?: boolean | null
  include_deleted?: boolean
}