"""Add initial AppWare data

Revision ID: a1b2c3d4e5f6
Revises: f7c8d9e1a2b3
Create Date: 2024-01-15 10:05:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'f7c8d9e1a2b3'
branch_labels = None
depends_on = None


def upgrade():
    # 获取当前时间
    now = datetime.utcnow()
    
    # 插入初始应用仓库数据
    appware_table = sa.table(
        'appware',
        sa.column('name', sa.String),
        sa.column('created_at', sa.DateTime),
        sa.column('created_by', sa.String),
        sa.column('updated_at', sa.DateTime),
        sa.column('updated_by', sa.String),
        sa.column('is_deleted', sa.Boolean),
        sa.column('sort_order', sa.Integer),
        sa.column('status', sa.Integer),
        sa.column('remark', sa.String),
        sa.column('version', sa.Integer),
        sa.column('is_active', sa.Boolean),
        sa.column('view_count', sa.BigInteger)
    )
    
    # 初始化示例数据
    initial_data = [
        {
            'name': '示例应用仓库1',
            'created_at': now,
            'created_by': 'system',
            'updated_at': now,
            'updated_by': 'system',
            'is_deleted': False,
            'sort_order': 1,
            'status': 1,
            'remark': '这是一个示例应用仓库，用于演示系统功能',
            'version': 1,
            'is_active': True,
            'view_count': 0
        },
        {
            'name': '示例应用仓库2',
            'created_at': now,
            'created_by': 'system',
            'updated_at': now,
            'updated_by': 'system',
            'is_deleted': False,
            'sort_order': 2,
            'status': 1,
            'remark': '另一个示例应用仓库，展示多样化的应用类型',
            'version': 1,
            'is_active': True,
            'view_count': 0
        },
        {
            'name': '热门应用仓库',
            'created_at': now,
            'created_by': 'system',
            'updated_at': now,
            'updated_by': 'system',
            'is_deleted': False,
            'sort_order': 0,
            'status': 1,
            'remark': '高人气的应用仓库，包含多个优秀应用',
            'version': 1,
            'is_active': True,
            'view_count': 100
        }
    ]
    
    op.bulk_insert(appware_table, initial_data)


def downgrade():
    # 删除初始化数据
    op.execute("DELETE FROM appware WHERE created_by = 'system'")