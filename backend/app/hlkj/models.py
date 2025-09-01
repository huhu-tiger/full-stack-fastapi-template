from datetime import datetime
from typing import Optional, Sequence, Any

from pydantic import EmailStr
from sqlalchemy import BigInteger, Column
from sqlmodel import Field, Relationship, SQLModel


# 基础模型类，包含常用字段
class BaseModel(SQLModel):
    """基础模型类，包含所有表的通用字段"""
    id: Optional[int] = Field(default=None, sa_column=Column(BigInteger(), primary_key=True), description="主键ID")
    name: str = Field(max_length=255, description="名称")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="创建时间")
    created_by: Optional[str] =Field(default=None, description="创建人ID")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="更新时间")
    updated_by: Optional[str] =Field(default=None, description="更新人ID")
    is_deleted: bool = Field(default=False, description="是否删除")
    sort_order: int = Field(default=0, description="排序")
    status: int = Field(default=1, description="状态 1:启用 0:禁用")


# 扩展的基础模型，包含常用的可选字段
class ExtendedBaseModel(BaseModel):
    """扩展基础模型，添加更多可选字段"""
    remark: str | None = Field(default=None, max_length=500, description="备注")
    version: int = Field(default=1, description="版本号")
    is_active: bool = Field(default=True, description="是否激活")

class AppWare(ExtendedBaseModel, table=True):
    """应用仓库"""
    view_count: Optional[int] = Field(default=None, sa_column=Column(BigInteger()), description="浏览量")


# AppWare 相关的 Pydantic 模型
class AppWareBase(SQLModel):
    """AppWare 基础模型"""
    name: str = Field(max_length=255, description="名称")
    remark: str | None = Field(default=None, max_length=500, description="备注")
    sort_order: int = Field(default=0, description="排序")
    status: int = Field(default=1, description="状态 1:启用 0:禁用")
    is_active: bool = Field(default=True, description="是否激活")
    view_count: Optional[int] = Field(default=0, description="浏览量")


class AppWareCreate(AppWareBase):
    """创建 AppWare 的模型"""
    pass


class AppWareUpdate(SQLModel):
    """更新 AppWare 的模型"""
    name: str | None = Field(default=None, max_length=255, description="名称")
    remark: str | None = Field(default=None, max_length=500, description="备注")
    sort_order: int | None = Field(default=None, description="排序")
    status: int | None = Field(default=None, description="状态 1:启用 0:禁用")
    is_active: bool | None = Field(default=None, description="是否激活")
    view_count: Optional[int] = Field(default=None, description="浏览量")


class AppWarePublic(AppWareBase):
    """公开的 AppWare 模型"""
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    version: int


class AppWaresPublic(SQLModel):
    """AppWare 列表响应模型"""
    data: Sequence[Any]
    count: int
