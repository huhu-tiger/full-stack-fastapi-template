from datetime import datetime
from typing import Any, Sequence, Annotated

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlmodel import Session, select, and_, desc, asc

from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.models import Message, User
from app.hlkj.models import (
    AppWare,
    AppWareCreate,
    AppWarePublic,
    AppWaresPublic,
    AppWareUpdate,
)

router = APIRouter(prefix="/appwares", tags=["appwares"])

"""
AppWare 权限说明：

1. 读取操作：
   - GET /appwares/ - 所有认证用户可以查看公开的应用仓库列表
   - GET /appwares/my - 用户只能查看自己创建的应用仓库
   - GET /appwares/popular - 查看热门应用仓库
   - GET /appwares/{id} - 查看应用仓库详情
   - GET /appwares/admin/all - 仅管理员可以查看所有记录（包括已删除）

2. 创建操作：
   - POST /appwares/ - 所有认证用户可以创建应用仓库

3. 修改/删除操作：
   - PUT /appwares/{id} - 仅创建者或管理员可以修改
   - DELETE /appwares/{id} - 仅创建者或管理员可以删除
"""


# CRUD 操作函数
def create_appware_db(*, session: Session, appware_create: AppWareCreate, creator_id: str | None = None) -> AppWare:
    """创建应用仓库记录"""
    current_time = datetime.utcnow()
    db_obj = AppWare.model_validate(
        appware_create, 
        update={
            "created_at": current_time,
            "updated_at": current_time,
            "created_by": creator_id,
            "updated_by": creator_id,
        }
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_appware_by_id_db(*, session: Session, appware_id: int) -> AppWare | None:
    """根据 ID 获取应用仓库记录"""
    statement = select(AppWare).where(
        and_(AppWare.id == appware_id, AppWare.is_deleted == False)
    )
    return session.exec(statement).first()


def get_appware_by_name_db(*, session: Session, name: str) -> AppWare | None:
    """根据名称获取应用仓库记录"""
    statement = select(AppWare).where(
        and_(AppWare.name == name, AppWare.is_deleted == False)
    )
    return session.exec(statement).first()


def get_appwares_db(
    *, session: Session, skip: int = 0, limit: int = 100, 
    status: int | None = None, is_active: bool | None = None
) -> Sequence[AppWare]:
    """获取应用仓库列表"""
    statement = select(AppWare).where(AppWare.is_deleted == False)
    
    if status is not None:
        statement = statement.where(AppWare.status == status)
    
    if is_active is not None:
        statement = statement.where(AppWare.is_active == is_active)
    
    statement = statement.order_by(asc(AppWare.sort_order), desc(AppWare.created_at))
    statement = statement.offset(skip).limit(limit)
    
    return session.exec(statement).all()


def get_appwares_count_db(
    *, session: Session, status: int | None = None, is_active: bool | None = None
) -> int:
    """获取应用仓库数量"""
    statement = select(AppWare).where(AppWare.is_deleted == False)
    
    if status is not None:
        statement = statement.where(AppWare.status == status)
    
    if is_active is not None:
        statement = statement.where(AppWare.is_active == is_active)
    
    return len(session.exec(statement).all())


def update_appware_db(
    *, session: Session, db_appware: AppWare, appware_in: AppWareUpdate, 
    updater_id: str | None = None
) -> AppWare:
    """更新应用仓库记录"""
    appware_data = appware_in.model_dump(exclude_unset=True)
    extra_data = {
        "updated_at": datetime.utcnow(),
        "updated_by": updater_id,
    }
    db_appware.sqlmodel_update(appware_data, update=extra_data)
    session.add(db_appware)
    session.commit()
    session.refresh(db_appware)
    return db_appware


def delete_appware_db(
    *, session: Session, db_appware: AppWare, deleter_id: str | None = None
) -> AppWare:
    """软删除应用仓库记录"""
    db_appware.is_deleted = True
    db_appware.updated_at = datetime.utcnow()
    db_appware.updated_by = deleter_id
    session.add(db_appware)
    session.commit()
    session.refresh(db_appware)
    return db_appware


def increment_view_count_db(*, session: Session, db_appware: AppWare) -> AppWare:
    """增加浏览量"""
    if db_appware.view_count is None:
        db_appware.view_count = 1
    else:
        db_appware.view_count += 1
    
    db_appware.updated_at = datetime.utcnow()
    session.add(db_appware)
    session.commit()
    session.refresh(db_appware)
    return db_appware


def get_popular_appwares_db(*, session: Session, limit: int = 10) -> Sequence[AppWare]:
    """获取热门应用仓库（按浏览量排序）"""
    statement = select(AppWare).where(
        and_(
            AppWare.is_deleted == False,
            AppWare.status == 1,
            AppWare.is_active == True
        )
    ).order_by(desc(AppWare.view_count), desc(AppWare.created_at)).limit(limit)
    
    return session.exec(statement).all()


# 路由端点


@router.get("/admin/all", response_model=AppWaresPublic)
def read_all_appwares_admin(
    session: SessionDep,
    current_superuser: Annotated[User, Depends(get_current_active_superuser)],
    skip: int = Query(default=0, ge=0, description="跳过数量"),
    limit: int = Query(default=100, ge=1, le=1000, description="限制数量"),
    status: int | None = Query(default=None, description="状态筛选"),
    is_active: bool | None = Query(default=None, description="是否激活筛选"),
    include_deleted: bool = Query(default=False, description="是否包含已删除记录"),
) -> Any:
    """
    管理员获取所有应用仓库列表（包括已删除的记录）
    """
    # 修改查询条件以支持包含已删除记录
    statement = select(AppWare)
    
    if not include_deleted:
        statement = statement.where(AppWare.is_deleted == False)
    
    if status is not None:
        statement = statement.where(AppWare.status == status)
    
    if is_active is not None:
        statement = statement.where(AppWare.is_active == is_active)
    
    statement = statement.order_by(asc(AppWare.sort_order), desc(AppWare.created_at))
    statement = statement.offset(skip).limit(limit)
    
    appwares = session.exec(statement).all()
    
    # 计算总数
    count_statement = select(AppWare)
    if not include_deleted:
        count_statement = count_statement.where(AppWare.is_deleted == False)
    if status is not None:
        count_statement = count_statement.where(AppWare.status == status)
    if is_active is not None:
        count_statement = count_statement.where(AppWare.is_active == is_active)
    
    count = len(session.exec(count_statement).all())
    
    return AppWaresPublic(data=appwares, count=count)


@router.get("/my", response_model=AppWaresPublic)
def read_my_appwares(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(default=0, ge=0, description="跳过数量"),
    limit: int = Query(default=100, ge=1, le=1000, description="限制数量"),
    status: int | None = Query(default=None, description="状态筛选"),
    is_active: bool | None = Query(default=None, description="是否激活筛选"),
) -> Any:
    """
    获取当前用户创建的应用仓库列表
    """
    statement = select(AppWare).where(
        and_(
            AppWare.is_deleted == False,
            AppWare.created_by == str(current_user.id)
        )
    )
    
    if status is not None:
        statement = statement.where(AppWare.status == status)
    
    if is_active is not None:
        statement = statement.where(AppWare.is_active == is_active)
    
    statement = statement.order_by(asc(AppWare.sort_order), desc(AppWare.created_at))
    statement = statement.offset(skip).limit(limit)
    
    appwares = session.exec(statement).all()
    
    # 计算总数
    count_statement = select(AppWare).where(
        and_(
            AppWare.is_deleted == False,
            AppWare.created_by == str(current_user.id)
        )
    )
    if status is not None:
        count_statement = count_statement.where(AppWare.status == status)
    if is_active is not None:
        count_statement = count_statement.where(AppWare.is_active == is_active)
    
    count = len(session.exec(count_statement).all())
    
    return AppWaresPublic(data=appwares, count=count)


@router.get("/", response_model=AppWaresPublic)
def read_appwares(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(default=0, ge=0, description="跳过数量"),
    limit: int = Query(default=100, ge=1, le=1000, description="限制数量"),
    status: int | None = Query(default=None, description="状态筛选"),
    is_active: bool | None = Query(default=None, description="是否激活筛选"),
) -> Any:
    """
    获取应用仓库列表
    """
    appwares = get_appwares_db(
        session=session, skip=skip, limit=limit, status=status, is_active=is_active
    )
    count = get_appwares_count_db(
        session=session, status=status, is_active=is_active
    )
    return AppWaresPublic(data=appwares, count=count)


@router.get("/popular", response_model=list[AppWarePublic])
def read_popular_appwares(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = Query(default=10, ge=1, le=50, description="限制数量"),
) -> Any:
    """
    获取热门应用仓库（按浏览量排序）
    """
    return get_popular_appwares_db(session=session, limit=limit)


@router.get("/{appware_id}", response_model=AppWarePublic)
def read_appware(
    session: SessionDep, current_user: CurrentUser, appware_id: int
) -> Any:
    """
    根据 ID 获取应用仓库详情
    """
    appware = get_appware_by_id_db(session=session, appware_id=appware_id)
    if not appware:
        raise HTTPException(status_code=404, detail="AppWare not found")
    
    # 增加浏览量
    increment_view_count_db(session=session, db_appware=appware)
    
    return appware


@router.post("/", response_model=AppWarePublic)
def create_appware(
    *, session: SessionDep, current_user: CurrentUser, appware_in: AppWareCreate
) -> Any:
    """
    创建新的应用仓库
    """
    # 检查名称是否已存在
    existing_appware = get_appware_by_name_db(session=session, name=appware_in.name)
    if existing_appware:
        raise HTTPException(
            status_code=400, detail="AppWare with this name already exists"
        )
    
    return create_appware_db(
        session=session, appware_create=appware_in, creator_id=str(current_user.id)
    )


@router.put("/{appware_id}", response_model=AppWarePublic)
def update_appware(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appware_id: int,
    appware_in: AppWareUpdate,
) -> Any:
    """
    更新应用仓库
    """
    appware = get_appware_by_id_db(session=session, appware_id=appware_id)
    if not appware:
        raise HTTPException(status_code=404, detail="AppWare not found")
    
    # 权限检查：只有创建者或超级用户可以修改
    if not current_user.is_superuser and appware.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # 如果更新名称，检查是否与其他记录冲突
    if appware_in.name and appware_in.name != appware.name:
        existing_appware = get_appware_by_name_db(session=session, name=appware_in.name)
        if existing_appware:
            raise HTTPException(
                status_code=400, detail="AppWare with this name already exists"
            )
    
    return update_appware_db(
        session=session, db_appware=appware, appware_in=appware_in, updater_id=str(current_user.id)
    )


@router.delete("/{appware_id}")
def delete_appware(
    session: SessionDep, current_user: CurrentUser, appware_id: int
) -> Message:
    """
    软删除应用仓库
    """
    appware = get_appware_by_id_db(session=session, appware_id=appware_id)
    if not appware:
        raise HTTPException(status_code=404, detail="AppWare not found")
    
    # 权限检查：只有创建者或超级用户可以删除
    if not current_user.is_superuser and appware.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    delete_appware_db(session=session, db_appware=appware, deleter_id=str(current_user.id))
    return Message(message="AppWare deleted successfully")