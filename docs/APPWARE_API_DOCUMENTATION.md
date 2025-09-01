# AppWare API 接口文档

## 📋 目录
1. [概述](#概述)
2. [认证说明](#认证说明)
3. [数据模型](#数据模型)
4. [API 端点](#api-端点)
5. [错误码说明](#错误码说明)
6. [使用示例](#使用示例)
7. [权限说明](#权限说明)

## 🔍 概述

AppWare API 提供应用仓库管理功能，支持创建、查询、更新和删除应用仓库记录。所有API都需要用户认证，部分操作需要特定权限。

**基础URL**: `/api/v1/appwares`

## 🔐 认证说明

所有 API 端点都需要 Bearer Token 认证：

```http
Authorization: Bearer <your_access_token>
```

## 📊 数据模型

### AppWare 基础模型
```python
{
    "name": "string",           # 名称（必填，最大255字符）
    "remark": "string",         # 备注（可选，最大500字符）
    "sort_order": 0,            # 排序（默认0）
    "status": 1,                # 状态（1:启用 0:禁用，默认1）
    "is_active": true,          # 是否激活（默认true）
    "view_count": 0             # 浏览量（默认0）
}
```

### AppWareCreate（创建时使用）
```python
{
    "name": "string",           # 必填
    "remark": "string",         # 可选
    "sort_order": 0,            # 可选，默认0
    "status": 1,                # 可选，默认1
    "is_active": true,          # 可选，默认true
    "view_count": 0             # 可选，默认0
}
```

### AppWareUpdate（更新时使用）
```python
{
    "name": "string",           # 可选
    "remark": "string",         # 可选
    "sort_order": 0,            # 可选
    "status": 1,                # 可选
    "is_active": true,          # 可选
    "view_count": 0             # 可选
}
```

### AppWarePublic（响应数据）
```python
{
    "id": 1,                    # 主键ID
    "name": "string",           # 名称
    "remark": "string",         # 备注
    "sort_order": 0,            # 排序
    "status": 1,                # 状态
    "is_active": true,          # 是否激活
    "view_count": 0,            # 浏览量
    "created_at": "2024-01-15T10:00:00Z",    # 创建时间
    "updated_at": "2024-01-15T10:00:00Z",    # 更新时间
    "is_deleted": false,        # 是否已删除
    "version": 1                # 版本号
}
```

### AppWaresPublic（列表响应）
```python
{
    "data": [AppWarePublic],    # 数据列表
    "count": 0                  # 总数量
}
```

## 🛠 API 端点

### 1. 获取应用仓库列表
**GET** `/appwares/`

获取所有公开的应用仓库列表（所有认证用户可访问）

#### 请求参数
- `skip` (query, int): 跳过数量，默认0，最小0
- `limit` (query, int): 限制数量，默认100，范围1-1000
- `status` (query, int): 状态筛选，可选（1:启用 0:禁用）
- `is_active` (query, bool): 是否激活筛选，可选

#### 响应
```json
{
    "data": [
        {
            "id": 1,
            "name": "示例应用",
            "remark": "这是一个示例应用仓库",
            "sort_order": 0,
            "status": 1,
            "is_active": true,
            "view_count": 10,
            "created_at": "2024-01-15T10:00:00Z",
            "updated_at": "2024-01-15T10:00:00Z",
            "is_deleted": false,
            "version": 1
        }
    ],
    "count": 1
}
```

#### 示例请求
```bash
curl -X GET "http://localhost:8000/api/v1/appwares/?skip=0&limit=10&status=1" \
     -H "Authorization: Bearer your_token_here"
```

---

### 2. 获取我的应用仓库列表
**GET** `/appwares/my`

获取当前用户创建的应用仓库列表

#### 请求参数
- `skip` (query, int): 跳过数量，默认0，最小0
- `limit` (query, int): 限制数量，默认100，范围1-1000
- `status` (query, int): 状态筛选，可选
- `is_active` (query, bool): 是否激活筛选，可选

#### 响应
与获取应用仓库列表相同

#### 示例请求
```bash
curl -X GET "http://localhost:8000/api/v1/appwares/my?skip=0&limit=10" \
     -H "Authorization: Bearer your_token_here"
```

---

### 3. 获取热门应用仓库
**GET** `/appwares/popular`

获取热门应用仓库列表（按浏览量排序）

#### 请求参数
- `limit` (query, int): 限制数量，默认10，范围1-50

#### 响应
```json
[
    {
        "id": 1,
        "name": "热门应用",
        "remark": "浏览量最高的应用",
        "sort_order": 0,
        "status": 1,
        "is_active": true,
        "view_count": 100,
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z",
        "is_deleted": false,
        "version": 1
    }
]
```

#### 示例请求
```bash
curl -X GET "http://localhost:8000/api/v1/appwares/popular?limit=5" \
     -H "Authorization: Bearer your_token_here"
```

---

### 4. 获取应用仓库详情
**GET** `/appwares/{appware_id}`

根据ID获取应用仓库详情，会自动增加浏览量

#### 路径参数
- `appware_id` (int): 应用仓库ID

#### 响应
```json
{
    "id": 1,
    "name": "应用详情",
    "remark": "应用仓库详细信息",
    "sort_order": 0,
    "status": 1,
    "is_active": true,
    "view_count": 11,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z",
    "is_deleted": false,
    "version": 1
}
```

#### 错误响应
- `404`: AppWare not found

#### 示例请求
```bash
curl -X GET "http://localhost:8000/api/v1/appwares/1" \
     -H "Authorization: Bearer your_token_here"
```

---

### 5. 创建应用仓库
**POST** `/appwares/`

创建新的应用仓库（所有认证用户可操作）

#### 请求体
```json
{
    "name": "新应用仓库",
    "remark": "应用仓库描述",
    "sort_order": 0,
    "status": 1,
    "is_active": true,
    "view_count": 0
}
```

#### 响应
创建成功的应用仓库对象

#### 错误响应
- `400`: AppWare with this name already exists

#### 示例请求
```bash
curl -X POST "http://localhost:8000/api/v1/appwares/" \
     -H "Authorization: Bearer your_token_here" \
     -H "Content-Type: application/json" \
     -d '{
         "name": "我的新应用",
         "remark": "这是一个新的应用仓库",
         "sort_order": 1,
         "status": 1,
         "is_active": true
     }'
```

---

### 6. 更新应用仓库
**PUT** `/appwares/{appware_id}`

更新指定的应用仓库（仅创建者或管理员可操作）

#### 路径参数
- `appware_id` (int): 应用仓库ID

#### 请求体
```json
{
    "name": "更新后的名称",
    "remark": "更新后的备注",
    "sort_order": 2,
    "status": 1,
    "is_active": true,
    "view_count": 20
}
```

#### 响应
更新后的应用仓库对象

#### 错误响应
- `404`: AppWare not found
- `403`: Not enough permissions
- `400`: AppWare with this name already exists（名称冲突）

#### 示例请求
```bash
curl -X PUT "http://localhost:8000/api/v1/appwares/1" \
     -H "Authorization: Bearer your_token_here" \
     -H "Content-Type: application/json" \
     -d '{
         "name": "更新的应用名称",
         "remark": "更新的描述信息"
     }'
```

---

### 7. 删除应用仓库
**DELETE** `/appwares/{appware_id}`

软删除指定的应用仓库（仅创建者或管理员可操作）

#### 路径参数
- `appware_id` (int): 应用仓库ID

#### 响应
```json
{
    "message": "AppWare deleted successfully"
}
```

#### 错误响应
- `404`: AppWare not found
- `403`: Not enough permissions

#### 示例请求
```bash
curl -X DELETE "http://localhost:8000/api/v1/appwares/1" \
     -H "Authorization: Bearer your_token_here"
```

---

### 8. 管理员获取所有应用仓库
**GET** `/appwares/admin/all`

管理员获取所有应用仓库列表，包括已删除的记录（仅超级用户可访问）

#### 请求参数
- `skip` (query, int): 跳过数量，默认0，最小0
- `limit` (query, int): 限制数量，默认100，范围1-1000
- `status` (query, int): 状态筛选，可选
- `is_active` (query, bool): 是否激活筛选，可选
- `include_deleted` (query, bool): 是否包含已删除记录，默认false

#### 响应
与获取应用仓库列表相同，但可能包含已删除的记录

#### 示例请求
```bash
curl -X GET "http://localhost:8000/api/v1/appwares/admin/all?include_deleted=true" \
     -H "Authorization: Bearer admin_token_here"
```

## ❌ 错误码说明

| HTTP状态码 | 错误信息 | 说明 |
|-----------|---------|------|
| 400 | AppWare with this name already exists | 应用仓库名称已存在 |
| 401 | Unauthorized | 未认证或Token无效 |
| 403 | Not enough permissions | 权限不足 |
| 404 | AppWare not found | 应用仓库不存在 |
| 422 | Validation Error | 请求参数验证失败 |
| 500 | Internal Server Error | 服务器内部错误 |

## 💡 使用示例

### Python 示例
```python
import requests

class AppWareClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.headers = {"Authorization": f"Bearer {token}"}
    
    def list_appwares(self, skip=0, limit=100, status=None, is_active=None):
        """获取应用仓库列表"""
        params = {"skip": skip, "limit": limit}
        if status is not None:
            params["status"] = status
        if is_active is not None:
            params["is_active"] = is_active
        
        response = requests.get(
            f"{self.base_url}/api/v1/appwares/",
            params=params,
            headers=self.headers
        )
        return response.json()
    
    def get_my_appwares(self, skip=0, limit=100):
        """获取我的应用仓库"""
        response = requests.get(
            f"{self.base_url}/api/v1/appwares/my",
            params={"skip": skip, "limit": limit},
            headers=self.headers
        )
        return response.json()
    
    def get_popular_appwares(self, limit=10):
        """获取热门应用仓库"""
        response = requests.get(
            f"{self.base_url}/api/v1/appwares/popular",
            params={"limit": limit},
            headers=self.headers
        )
        return response.json()
    
    def get_appware(self, appware_id):
        """获取应用仓库详情"""
        response = requests.get(
            f"{self.base_url}/api/v1/appwares/{appware_id}",
            headers=self.headers
        )
        return response.json()
    
    def create_appware(self, appware_data):
        """创建应用仓库"""
        response = requests.post(
            f"{self.base_url}/api/v1/appwares/",
            json=appware_data,
            headers=self.headers
        )
        return response.json()
    
    def update_appware(self, appware_id, appware_data):
        """更新应用仓库"""
        response = requests.put(
            f"{self.base_url}/api/v1/appwares/{appware_id}",
            json=appware_data,
            headers=self.headers
        )
        return response.json()
    
    def delete_appware(self, appware_id):
        """删除应用仓库"""
        response = requests.delete(
            f"{self.base_url}/api/v1/appwares/{appware_id}",
            headers=self.headers
        )
        return response.json()

# 使用示例
client = AppWareClient("http://localhost:8000", "your_token_here")

# 1. 创建应用仓库
new_appware = client.create_appware({
    "name": "测试应用",
    "remark": "这是一个测试应用仓库",
    "sort_order": 1,
    "status": 1,
    "is_active": True
})
print("创建成功:", new_appware)

# 2. 获取应用仓库列表
appwares = client.list_appwares(skip=0, limit=10, status=1)
print("应用仓库列表:", appwares)

# 3. 获取详情
if appwares["data"]:
    appware_id = appwares["data"][0]["id"]
    detail = client.get_appware(appware_id)
    print("应用仓库详情:", detail)

# 4. 更新应用仓库
if appwares["data"]:
    appware_id = appwares["data"][0]["id"]
    updated = client.update_appware(appware_id, {
        "remark": "更新后的备注信息"
    })
    print("更新成功:", updated)
```

### JavaScript 示例
```javascript
class AppWareAPI {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async listAppwares(skip = 0, limit = 100, status = null, isActive = null) {
        const params = new URLSearchParams({ skip, limit });
        if (status !== null) params.append('status', status);
        if (isActive !== null) params.append('is_active', isActive);

        const response = await fetch(
            `${this.baseUrl}/api/v1/appwares/?${params}`,
            { headers: this.headers }
        );
        return response.json();
    }

    async createAppware(appwareData) {
        const response = await fetch(
            `${this.baseUrl}/api/v1/appwares/`,
            {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(appwareData)
            }
        );
        return response.json();
    }

    async getAppware(appwareId) {
        const response = await fetch(
            `${this.baseUrl}/api/v1/appwares/${appwareId}`,
            { headers: this.headers }
        );
        return response.json();
    }

    async updateAppware(appwareId, appwareData) {
        const response = await fetch(
            `${this.baseUrl}/api/v1/appwares/${appwareId}`,
            {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(appwareData)
            }
        );
        return response.json();
    }

    async deleteAppware(appwareId) {
        const response = await fetch(
            `${this.baseUrl}/api/v1/appwares/${appwareId}`,
            {
                method: 'DELETE',
                headers: this.headers
            }
        );
        return response.json();
    }
}

// 使用示例
const api = new AppWareAPI('http://localhost:8000', 'your_token_here');

// 创建应用仓库
api.createAppware({
    name: 'JavaScript应用',
    remark: '使用JavaScript创建的应用仓库',
    sort_order: 1,
    status: 1,
    is_active: true
}).then(result => console.log('创建成功:', result));
```

## 🔐 权限说明

### 读取操作权限
- **获取应用仓库列表** (`GET /appwares/`): 所有认证用户
- **获取我的应用仓库** (`GET /appwares/my`): 所有认证用户（仅显示自己创建的）
- **获取热门应用仓库** (`GET /appwares/popular`): 所有认证用户
- **获取应用仓库详情** (`GET /appwares/{id}`): 所有认证用户
- **管理员获取所有数据** (`GET /appwares/admin/all`): 仅超级用户

### 创建操作权限
- **创建应用仓库** (`POST /appwares/`): 所有认证用户

### 修改/删除操作权限
- **更新应用仓库** (`PUT /appwares/{id}`): 仅创建者或超级用户
- **删除应用仓库** (`DELETE /appwares/{id}`): 仅创建者或超级用户

### 权限检查逻辑
```python
# 对于修改和删除操作
if not current_user.is_superuser and appware.created_by != str(current_user.id):
    raise HTTPException(status_code=403, detail="Not enough permissions")
```

## 📝 注意事项

1. **软删除**: 删除操作为软删除，记录不会从数据库中物理删除，而是设置 `is_deleted = True`
2. **浏览量自增**: 每次调用获取详情接口时，浏览量会自动增加1
3. **名称唯一性**: 应用仓库名称在未删除的记录中必须唯一
4. **排序规则**: 列表查询时按 `sort_order` 升序，`created_at` 降序排列
5. **分页限制**: 单次查询最多返回1000条记录
6. **认证要求**: 所有接口都需要有效的JWT Token

## 🔗 相关文档

- [用户认证指南](./auth_guide.md)
- [数据库操作说明](./APPWARE_OPERATIONS.md)
- [API 总体文档](./API_DOCUMENTATION.md)