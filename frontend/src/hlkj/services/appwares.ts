import { OpenAPI } from "@/client/core/OpenAPI"
import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { request as __request } from "@/client/core/request"
import type { Message } from "@/client/types.gen"
import type {
  AppWarePublic,
  AppWaresPublic,
  AppWaresReadAppWaresData,
  AppWaresReadMyAppWaresData,
  AppWaresReadPopularAppWaresData,
  AppWaresReadAppWareData,
  AppWaresCreateAppWareData,
  AppWaresUpdateAppWareData,
  AppWaresDeleteAppWareData,
  AppWaresReadAllAppWaresAdminData,
} from "../types/appware"

export class AppWaresService {
  /**
   * Read AppWares
   * 获取应用仓库列表
   */
  public static readAppWares(
    data: AppWaresReadAppWaresData = {},
  ): CancelablePromise<AppWaresPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appwares/",
      query: {
        skip: data.skip,
        limit: data.limit,
        status: data.status,
        is_active: data.is_active,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read My AppWares
   * 获取当前用户的应用仓库列表
   */
  public static readMyAppWares(
    data: AppWaresReadMyAppWaresData = {},
  ): CancelablePromise<AppWaresPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appwares/my",
      query: {
        skip: data.skip,
        limit: data.limit,
        status: data.status,
        is_active: data.is_active,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Popular AppWares
   * 获取热门应用仓库列表
   */
  public static readPopularAppWares(
    data: AppWaresReadPopularAppWaresData = {},
  ): CancelablePromise<AppWarePublic[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appwares/popular",
      query: {
        limit: data.limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read AppWare
   * 根据 ID 获取应用仓库详情
   */
  public static readAppWare(
    data: AppWaresReadAppWareData,
  ): CancelablePromise<AppWarePublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appwares/{appware_id}",
      path: {
        appware_id: data.appware_id,
      },
      errors: {
        404: "Not Found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Create AppWare
   * 创建新的应用仓库
   */
  public static createAppWare(
    data: AppWaresCreateAppWareData,
  ): CancelablePromise<AppWarePublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/appwares/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        400: "Bad Request",
        422: "Validation Error",
      },
    })
  }

  /**
   * Update AppWare
   * 更新应用仓库
   */
  public static updateAppWare(
    data: AppWaresUpdateAppWareData,
  ): CancelablePromise<AppWarePublic> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/appwares/{appware_id}",
      path: {
        appware_id: data.appware_id,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        400: "Bad Request",
        403: "Forbidden",
        404: "Not Found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete AppWare
   * 软删除应用仓库
   */
  public static deleteAppWare(
    data: AppWaresDeleteAppWareData,
  ): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/appwares/{appware_id}",
      path: {
        appware_id: data.appware_id,
      },
      errors: {
        403: "Forbidden",
        404: "Not Found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Read All AppWares Admin
   * 管理员获取所有应用仓库列表
   */
  public static readAllAppWaresAdmin(
    data: AppWaresReadAllAppWaresAdminData = {},
  ): CancelablePromise<AppWaresPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/appwares/admin/all",
      query: {
        skip: data.skip,
        limit: data.limit,
        status: data.status,
        is_active: data.is_active,
        include_deleted: data.include_deleted,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}