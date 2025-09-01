# FastAPI 认证使用指南

## 认证流程

### 1. 登录获取 Token

```bash
# 使用 curl 登录
curl -X POST "http://localhost:8000/api/v1/login/access-token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=changethis"
```

响应：
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDk4ODg4ODgsInN1YiI6IjEyMzQ1Njc4LTkwYWItY2RlZi0xMjM0LTU2Nzg5MGFiY2RlZiJ9.signature",
  "token_type": "bearer"
}
```

### 2. 使用 Token 访问受保护的接口

```bash
# 使用 Token 访问 AppWare 接口
curl -X GET "http://localhost:8000/api/v1/appwares/" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

## 不同客户端的实现方式

### JavaScript/TypeScript (前端)

```javascript
// 1. 登录获取 token
async function login(email, password) {
  const response = await fetch('/api/v1/login/access-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
}

// 2. 使用 token 请求数据
async function getAppWares() {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/v1/appwares/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
}

// 3. 创建一个通用的 fetch 函数
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('access_token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
}
```

### Python (客户端)

```python
import requests

class APIClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.token = None
    
    def login(self, email, password):
        """登录获取 token"""
        response = requests.post(
            f"{self.base_url}/api/v1/login/access-token",
            data={"username": email, "password": password}
        )
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            return True
        return False
    
    def _get_headers(self):
        """获取包含认证信息的请求头"""
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def get_appwares(self):
        """获取应用仓库列表"""
        response = requests.get(
            f"{self.base_url}/api/v1/appwares/",
            headers=self._get_headers()
        )
        return response.json()
    
    def create_appware(self, appware_data):
        """创建应用仓库"""
        response = requests.post(
            f"{self.base_url}/api/v1/appwares/",
            json=appware_data,
            headers=self._get_headers()
        )
        return response.json()

# 使用示例
client = APIClient()
client.login("admin@example.com", "changethis")
appwares = client.get_appwares()
```

## CurrentUser 依赖注入工作原理

```python
# 1. OAuth2PasswordBearer 从请求头中提取 token
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

# 2. get_current_user 解析 token 并获取用户
def get_current_user(session: SessionDep, token: TokenDep) -> User:
    # 解码 JWT token
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
    token_data = TokenPayload(**payload)  # token_data.sub 包含用户 ID
    
    # 从数据库获取用户信息
    user = session.get(User, token_data.sub)
    return user

# 3. CurrentUser 类型注解
CurrentUser = Annotated[User, Depends(get_current_user)]
```

## 测试认证功能

```bash
# 1. 测试登录
curl -X POST "http://localhost:8000/api/v1/login/access-token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=changethis"

# 2. 测试 token 有效性
curl -X POST "http://localhost:8000/api/v1/login/test-token" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. 测试受保护的接口
curl -X GET "http://localhost:8000/api/v1/appwares/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 常见错误及解决方案

### 401 Unauthorized
- 原因：未提供 token 或 token 无效
- 解决：检查 Authorization 头是否正确设置

### 403 Forbidden  
- 原因：用户权限不足
- 解决：确保用户有相应的权限

### 404 User not found
- 原因：token 中的用户 ID 在数据库中不存在
- 解决：重新登录获取新的 token