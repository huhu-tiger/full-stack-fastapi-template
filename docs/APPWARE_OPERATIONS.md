# AppWare 表操作说明文档

## 📋 目录
1. [模型定义](#模型定义)
2. [数据库迁移](#数据库迁移)
3. [同步数据库](#同步数据库)
4. [验证操作](#验证操作)
5. [常见问题](#常见问题)
6. [最佳实践](#最佳实践)

## 📊 模型定义

AppWare 表已在以下文件中定义：

### 文件结构
```
backend/app/hlkj/
├── models.py          # 模型定义
├── routes/
│   └── app.py        # 路由定义
└── __init__.py

backend/app/
├── models.py         # 主模型文件（需导入 AppWare）
└── alembic/
    └── versions/     # 大模型生成
        ├── f7c8d9e1a2b3_add_appware_table.py      # 表结构迁移
        └── a1b2c3d4e5f6_add_initial_appware_data.py  # 初始数据
```

### 模型字段说明
```python
class AppWare(ExtendedBaseModel, table=True):
    """应用仓库模型"""
    # 继承 ExtendedBaseModel 的字段：
    # - id: int (主键)
    # - name: str (名称)
    # - created_at: datetime (创建时间)
    # - created_by: str (创建人ID)
    # - updated_at: datetime (更新时间)
    # - updated_by: str (更新人ID)
    # - is_deleted: bool (是否删除)
    # - sort_order: int (排序)
    # - status: int (状态)
    # - remark: str (备注)
    # - version: int (版本号)
    # - is_active: bool (是否激活)
    
    # AppWare 特有字段：
    view_count: Optional[int] = Field(default=None, description="浏览量")
```

## 🔄 数据库迁移

### 1. 检查当前迁移状态
```bash
cd backend
alembic current
```

### 2. 查看所有可用迁移
```bash
alembic history --verbose
```

### 3. 执行迁移到最新版本
```bash
alembic upgrade head
```

### 4. 回滚到特定版本（如果需要）
```bash
# 回滚到 AppWare 表创建之前
alembic downgrade 1a31ce608336

# 回滚到基线版本
alembic downgrade base
```

## 🔄 同步数据库

### 方法一：使用 Alembic（推荐）

#### 1. 确保模型已导入
确认 `backend/app/models.py` 中包含：
```python
from app.hlkj.models import AppWare  # noqa
```

#### 2. 执行迁移
```bash
cd backend
alembic upgrade head
```

#### 3. 验证表结构
```sql
-- 连接数据库后执行
\d appware
```

### 方法二：强制重新创建（开发环境）

#### ⚠️ 警告：此操作会删除现有数据
```bash
cd backend

# 1. 删除所有迁移版本记录
alembic downgrade base

# 2. 删除表（在数据库中执行）
# DROP TABLE IF EXISTS appware CASCADE;

# 3. 重新执行迁移
alembic upgrade head
```

### 方法三：自动生成新迁移（模型变更时）

#### 当 AppWare 模型发生变更时：
```bash
cd backend

# 1. 生成新迁移文件
alembic revision --autogenerate -m "Update AppWare model"

# 2. 检查生成的迁移文件
# 编辑 backend/app/alembic/versions/新生成的文件.py

# 3. 执行迁移
alembic upgrade head
```

## ✅ 验证操作

### 1. 验证表是否创建成功
```bash
cd backend
python -c "
from sqlmodel import Session, create_engine, select
from app.core.config import settings
from app.hlkj.models import AppWare

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
with Session(engine) as session:
    try:
        # 尝试查询 AppWare 表
        count = len(session.exec(select(AppWare)).all())
        print(f'✅ AppWare 表创建成功，当前记录数: {count}')
    except Exception as e:
        print(f'❌ AppWare 表验证失败: {e}')
"
```

### 2. 验证索引是否创建
```sql
-- 在数据库中执行
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'appware';
```

### 3. 验证初始数据
```bash
cd backend
python -c "
from sqlmodel import Session, create_engine, select
from app.core.config import settings
from app.hlkj.models import AppWare

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
with Session(engine) as session:
    appwares = session.exec(select(AppWare)).all()
    print(f'初始数据记录数: {len(appwares)}')
    for appware in appwares:
        print(f'- {appware.name}: {appware.remark}')
"
```

### 4. 测试 API 接口
```bash
# 启动服务
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 测试接口（需要先获取 token）
curl -X GET "http://localhost:8000/api/v1/appwares/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 常见问题

### 问题1：表已存在错误
```
sqlalchemy.exc.ProgrammingError: (psycopg.errors.DuplicateTable) relation "appware" already exists
```

**解决方案：**
```bash
# 方法1：标记当前版本已执行
alembic stamp head

# 方法2：删除表后重新创建
# 在数据库中执行: DROP TABLE IF EXISTS appware CASCADE;
# 然后执行: alembic upgrade head
```

### 问题2：模型导入错误
```
ImportError: cannot import name 'AppWare' from 'app.hlkj.models'
```

**解决方案：**
```bash
# 检查文件是否存在
ls -la backend/app/hlkj/models.py

# 检查模型定义是否正确
python -c "from app.hlkj.models import AppWare; print('模型导入成功')"
```

### 问题3：数据库连接错误
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**解决方案：**
```bash
# 检查数据库配置
cat .env | grep POSTGRES

# 测试数据库连接
python -c "
from app.core.config import settings
print(f'数据库连接: {settings.SQLALCHEMY_DATABASE_URI}')
"
```

### 问题4：迁移版本冲突
```
alembic.util.exc.CommandError: Multiple head revisions are present
```

**解决方案：**
```bash
# 查看分支情况
alembic branches

# 合并分支
alembic merge heads -m "Merge branches"

# 执行迁移
alembic upgrade head
```

## 🏆 最佳实践

### 1. 开发流程
```bash
# 1. 修改模型
vim backend/app/hlkj/models.py

# 2. 生成迁移
alembic revision --autogenerate -m "描述性的迁移信息"

# 3. 检查迁移文件
vim backend/app/alembic/versions/新文件.py

# 4. 执行迁移
alembic upgrade head

# 5. 验证变更
python -c "验证代码"
```

### 2. 生产环境部署
```bash
# 1. 备份数据库
pg_dump your_database > backup.sql

# 2. 测试迁移（在测试环境）
alembic upgrade head

# 3. 执行生产迁移
alembic upgrade head

# 4. 验证结果
# 运行验证脚本
```

### 3. 团队协作
- 每次模型变更都要创建迁移文件
- 迁移文件要提交到版本控制
- 团队成员按顺序执行迁移
- 不要手动修改已提交的迁移文件

### 4. 性能优化
```sql
-- 监控表大小
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'appware';

-- 检查索引使用情况
SELECT 
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE relname = 'appware';
```

## 📚 相关命令参考

### Alembic 常用命令
```bash
# 查看帮助
alembic --help

# 初始化 Alembic（项目已初始化）
alembic init alembic

# 创建迁移
alembic revision -m "描述"
alembic revision --autogenerate -m "描述"

# 执行迁移
alembic upgrade head
alembic upgrade +1
alembic upgrade ae1027a6acf

# 回滚迁移
alembic downgrade -1
alembic downgrade base

# 查看状态
alembic current
alembic history
alembic show ae1027a6acf
```

### 数据库操作
```sql
-- 查看表结构
\d appware

-- 查看索引
\di appware*

-- 查看表大小
SELECT pg_size_pretty(pg_total_relation_size('appware'));

-- 查看行数
SELECT count(*) FROM appware;
```

## 🔗 相关文件

- **模型定义**: `backend/app/hlkj/models.py`
- **路由定义**: `backend/app/hlkj/routes/app.py`
- **数据库配置**: `backend/app/core/db.py`
- **Alembic 配置**: `backend/alembic.ini`
- **环境变量**: `.env`
- **迁移文件**: `backend/app/alembic/versions/`

按照这个文档的步骤操作，你应该能够成功创建和管理 AppWare 表！