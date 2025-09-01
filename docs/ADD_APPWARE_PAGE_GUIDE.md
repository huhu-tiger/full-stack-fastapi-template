# 增加 AppWare 页面说明文档

## 概述

本文档详细介绍了如何在 Full Stack FastAPI Template 项目中创建 AppWare（应用仓库）管理功能的完整流程，包括前端页面组件、路由配置、后端 API 集成等。

## 项目架构

### 技术栈
- **前端**: React v18+ + TypeScript + Vite + Chakra UI
- **后端**: FastAPI + SQLModel + PostgreSQL
- **路由**: TanStack Router
- **状态管理**: TanStack Query
- **表单管理**: React Hook Form

## 文件结构

```
frontend/src/
├── hlkj/                           # AppWare 业务模块
│   ├── pages/                      # 页面组件（核心业务逻辑）
│   │   ├── AppWaresPage.tsx        # 应用仓库管理页面
│   │   ├── MyAppWaresPage.tsx      # 我的应用仓库页面
│   │   └── PopularAppWaresPage.tsx # 热门应用仓库页面
│   ├── components/                 # 业务组件
│   │   ├── Appware/
│   │   │   ├── AddAppware.tsx      # 添加应用仓库组件
│   │   │   ├── EditAppware.tsx     # 编辑应用仓库组件
│   │   │   └── DeleteAppare.tsx    # 删除应用仓库组件
│   │   └── Common/
│   │       └── AppWareActionsMenu.tsx # 操作菜单组件
│   ├── services/                   # API 服务
│   │   └── appwares.ts             # AppWare API 接口
│   └── types/                      # 类型定义
│       └── appware.ts              # AppWare 类型定义
├── routes/_layout/                 # 标准路由配置
│   ├── appwares.tsx                # 应用仓库路由
│   ├── my-appwares.tsx             # 我的应用仓库路由
│   └── popular-appwares.tsx        # 热门应用仓库路由
├── components/ui/                  # 通用 UI 组件
│   ├── number-input.tsx            # 数字输入组件
│   ├── switch.tsx                  # 开关组件
│   ├── dialog.tsx                  # 对话框组件
│   └── field.tsx                   # 表单字段组件
└── routeTree.gen.ts               # 自动生成的路由树
```

## 核心组件详解

### 1. AddAppware 组件 (`/hlkj/components/Appware/AddAppware.tsx`)

**功能**: 创建新的应用仓库

**主要特性**:
- 弹窗表单设计
- 表单验证（React Hook Form）
- 数据提交（TanStack Query mutations）
- 实时状态反馈

**关键代码结构**:
```typescript
const AddAppWare = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<AppWareCreate>({
    defaultValues: {
      name: "",
      remark: "",
      sort_order: 0,
      status: 1,
      is_active: true,
      view_count: 0,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: AppWareCreate) =>
      AppWaresService.createAppWare({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("应用仓库创建成功！")
      reset()
      setIsOpen(false)
    },
  })

  return (
    <DialogRoot>
      {/* 触发按钮和表单内容 */}
    </DialogRoot>
  )
}
```

**表单字段**:
- `name` (必填): 应用仓库名称
- `remark` (可选): 备注信息
- `sort_order` (数字): 排序号
- `status` (数字): 状态 (1:启用 0:禁用)
- `is_active` (布尔): 是否激活
- `view_count` (数字): 浏览量（通常初始为0）

### 2. EditAppware 组件 (`/hlkj/components/Appware/EditAppware.tsx`)

**功能**: 编辑现有的应用仓库

**主要特性**:
- 预填充表单数据
- 受控组件模式
- 权限验证（仅创建者或管理员可编辑）

**与 AddAppware 的区别**:
```typescript
// 默认值来自现有数据
defaultValues: {
  name: appware.name,
  remark: appware.remark ?? "",
  sort_order: appware.sort_order,
  status: appware.status,
  is_active: appware.is_active,
  view_count: appware.view_count,
}

// API 调用不同
mutationFn: (data: AppWareUpdate) =>
  AppWaresService.updateAppWare({ 
    appware_id: appware.id, 
    requestBody: data 
  })
```

### 3. DeleteAppare 组件 (`/hlkj/components/Appware/DeleteAppare.tsx`)

**功能**: 删除应用仓库

**主要特性**:
- 确认对话框
- 简单的删除操作
- 权限控制

### 4. 页面组件结构

#### AppWaresPage (`/hlkj/pages/AppWaresPage.tsx`)
- **用途**: 显示所有应用仓库列表
- **特性**: 分页、搜索、CRUD 操作
- **权限**: 认证用户可访问

#### MyAppWaresPage (`/hlkj/pages/MyAppWaresPage.tsx`)
- **用途**: 显示当前用户创建的应用仓库
- **特性**: 个人数据管理
- **权限**: 仅显示用户自己的数据

#### PopularAppWaresPage (`/hlkj/pages/PopularAppWaresPage.tsx`)
- **用途**: 按浏览量排序显示热门应用仓库
- **特性**: 排名展示、热度标识
- **权限**: 认证用户可访问

## 自定义组件使用规范

### NumberInput 组件
```typescript
// ✅ 正确使用方式（受控组件）
<NumberInputRoot
  min={0}
  value={watch("sort_order")?.toString() || ""}
  onValueChange={(details) => setValue("sort_order", details.valueAsNumber)}
>
  <NumberInputField placeholder="排序号" />
</NumberInputRoot>

// ❌ 错误使用方式
<NumberInputRoot {...register("sort_order", { valueAsNumber: true })}>
```

### Switch 组件
```typescript
// ✅ 正确使用方式
import { Switch } from "../../../components/ui/switch"

<Switch
  checked={watch("is_active") ?? false}
  onCheckedChange={(details) => setValue("is_active", details.checked)}
/>

// ❌ 错误使用方式
import { Switch } from "@chakra-ui/react"
```

## 路由配置

### 1. 页面路由文件 (`/routes/_layout/`)

每个路由文件都遵循相同的模式：
```typescript
import { createFileRoute } from "@tanstack/react-router"
import { AppWaresPage, appwaresSearchSchema } from "@/hlkj/pages/AppWaresPage"

export const Route = createFileRoute("/_layout/appwares")({
  component: AppWares,
  validateSearch: (search) => appwaresSearchSchema.parse(search),
})

function AppWares() {
  const { page } = Route.useSearch()
  return <AppWaresPage routeFullPath={Route.fullPath} page={page} />
}
```

### 2. 路由树配置 (`routeTree.gen.ts`)

自动生成的路由树包含：
```typescript
// 导入路由
import { Route as LayoutAppwaresImport } from './routes/_layout/appwares'
import { Route as LayoutMyAppwaresImport } from './routes/_layout/my-appwares'
import { Route as LayoutPopularAppwaresImport } from './routes/_layout/popular-appwares'

// 创建路由实例
const LayoutAppwaresRoute = LayoutAppwaresImport.update({
  path: '/appwares',
  getParentRoute: () => LayoutRoute,
})

// 路由接口定义
interface FileRoutesByPath {
  '/_layout/appwares': {
    preLoaderRoute: typeof LayoutAppwaresImport
    parentRoute: typeof LayoutImport
  }
  // ...其他路由
}
```

### 3. 侧边栏菜单配置 (`/components/Common/SidebarItems.tsx`)

```typescript
const items = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiBriefcase, title: "Items", path: "/items" },
  { icon: FiPackage, title: "应用仓库", path: "/appwares" },
  { icon: FiUser, title: "我的仓库", path: "/my-appwares" },
  { icon: FiTrendingUp, title: "热门仓库", path: "/popular-appwares" },
  { icon: FiSettings, title: "User Settings", path: "/settings" },
]
```

## API 集成

### 服务接口 (`/hlkj/services/appwares.ts`)

```typescript
export class AppWaresService {
  // 获取应用仓库列表
  public static readAppWares({ skip, limit }: { skip?: number; limit?: number }): Promise<AppWaresResponse>
  
  // 获取我的应用仓库
  public static readMyAppWares({ skip, limit }: { skip?: number; limit?: number }): Promise<AppWaresResponse>
  
  // 获取热门应用仓库
  public static readPopularAppWares({ limit }: { limit?: number }): Promise<AppWarePublic[]>
  
  // 创建应用仓库
  public static createAppWare({ requestBody }: { requestBody: AppWareCreate }): Promise<AppWarePublic>
  
  // 更新应用仓库
  public static updateAppWare({ appware_id, requestBody }: { appware_id: number; requestBody: AppWareUpdate }): Promise<AppWarePublic>
  
  // 删除应用仓库
  public static deleteAppWare({ appware_id }: { appware_id: number }): Promise<Message>
}
```

### React Query 使用

```typescript
// 查询数据
const { data, isLoading } = useQuery({
  queryFn: () => AppWaresService.readAppWares({ skip: 0, limit: 5 }),
  queryKey: ["appwares", { page: 1 }],
})

// 变更数据
const mutation = useMutation({
  mutationFn: (data: AppWareCreate) =>
    AppWaresService.createAppWare({ requestBody: data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["appwares"] })
  },
})
```

## 权限控制

### 前端权限展示
- 所有认证用户都可以查看应用仓库列表
- 用户只能编辑/删除自己创建的应用仓库
- 管理员可以编辑/删除所有应用仓库

### 后端权限验证
```python
# 基本权限检查
if not current_user.is_superuser and resource.created_by != str(current_user.id):
    raise HTTPException(status_code=403, detail="Not enough permissions")
```

## 状态管理

### 表单状态
- 使用 React Hook Form 管理表单状态
- 表单验证规则在组件内定义
- 提交状态通过 mutation 的 isSubmitting 跟踪

### 全局状态
- 使用 TanStack Query 管理服务器状态
- 自动缓存和同步
- 乐观更新支持

## 样式和UI

### Chakra UI 组件使用
```typescript
// 布局组件
<Container maxW="full">
  <Heading size="lg" pt={12}>应用仓库管理</Heading>
  <VStack gap={4}>
    {/* 内容 */}
  </VStack>
</Container>

// 表格组件
<Table.Root size={{ base: "sm", md: "md" }}>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>名称</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {/* 表格行 */}
  </Table.Body>
</Table.Root>
```

### 响应式设计
- 使用 Chakra UI 的响应式属性
- 移动端优化的表格显示
- 弹性布局适配不同屏幕

## 错误处理

### 前端错误处理
```typescript
const mutation = useMutation({
  mutationFn: createFunction,
  onError: (err: ApiError) => {
    handleError(err) // 统一错误处理
  },
})
```

### 用户反馈
- 成功操作：Toast 提示
- 错误信息：详细错误展示
- 加载状态：Loading 指示器

## 测试建议

### 单元测试
- 组件渲染测试
- 表单验证测试
- API 调用模拟测试

### 集成测试
- 完整的用户操作流程
- 权限验证测试
- 端到端功能测试

### 测试工具
- React Testing Library
- Jest
- Playwright (E2E)

## 部署注意事项

### 构建优化
- TypeScript 编译检查
- 代码分割和懒加载
- 资源压缩优化

### 环境配置
- API 端点配置
- 认证密钥管理
- 数据库连接设置

## 扩展指南

### 添加新字段
1. 更新类型定义 (`types/appware.ts`)
2. 修改表单组件 (Add/Edit components)
3. 更新 API 接口
4. 更新列表显示

### 添加新功能
1. 创建新的组件
2. 添加路由配置
3. 更新菜单导航
4. 实现权限控制

### 性能优化
1. 实现虚拟滚动（大数据量）
2. 添加搜索和过滤功能
3. 优化网络请求
4. 缓存策略改进

## 常见问题

### Q: 组件导入错误 "Element type is invalid"
A: 确保从正确的路径导入自定义组件，而不是直接从第三方库导入。

### Q: 表单数据不更新
A: 检查是否正确使用了受控组件模式，确保 `value` 和 `onChange` 属性正确绑定。

### Q: 权限验证失败
A: 确认用户已登录且具有相应权限，检查后端 API 权限设置。

### Q: 路由不生效
A: 确保路由已正确添加到 `routeTree.gen.ts` 并且菜单项已更新。

## 维护指南

### 代码规范
- 遵循 TypeScript 严格模式
- 使用 Biome 进行代码格式化
- 保持组件功能单一性

### 性能监控
- 监控 API 响应时间
- 追踪组件渲染性能
- 关注用户体验指标

### 更新流程
1. 测试新功能
2. 代码审查
3. 渐进式部署
4. 用户反馈收集

---

本文档涵盖了 AppWare 页面创建的完整流程和最佳实践。如有其他问题，请参考项目的其他文档或联系开发团队。