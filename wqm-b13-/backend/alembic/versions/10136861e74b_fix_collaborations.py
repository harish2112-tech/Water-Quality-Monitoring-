"""fix_collaborations

Revision ID: 10136861e74b
Revises: 
Create Date: 2026-03-31 13:43:54.572706

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10136861e74b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Update collaborations table structure
    op.add_column('collaborations', sa.Column('ngo_user_id', sa.Integer(), nullable=True))
    op.execute(sa.text("UPDATE collaborations SET ngo_user_id = 2 WHERE ngo_user_id IS NULL"))
    op.alter_column('collaborations', 'ngo_user_id', nullable=False)
    op.create_foreign_key('fk_collaboration_ngo_user', 'collaborations', 'users', ['ngo_user_id'], ['id'])

    op.add_column('collaborations', sa.Column('station_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_collaboration_station', 'collaborations', 'water_stations', ['station_id'], ['id'])

    op.add_column('collaborations', sa.Column('ngo_name', sa.String(), nullable=True))
    op.execute(sa.text("UPDATE collaborations SET ngo_name = 'NGO Name' WHERE ngo_name IS NULL"))
    op.alter_column('collaborations', 'ngo_name', nullable=False)
    
    op.add_column('collaborations', sa.Column('contact_email', sa.String(), nullable=True))
    op.execute(sa.text("UPDATE collaborations SET contact_email = 'ngo@example.com' WHERE contact_email IS NULL"))
    op.alter_column('collaborations', 'contact_email', nullable=False)

    # 2. Handle Status Enum
    op.execute(sa.text("DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaborationstatus') THEN CREATE TYPE collaborationstatus AS ENUM ('active', 'inactive'); END IF; END $$;"))
    op.execute(sa.text("UPDATE collaborations SET status = 'active' WHERE status IS NULL OR status NOT IN ('active', 'inactive')"))
    
    op.alter_column('collaborations', 'status',
               existing_type=sa.String(),
               type_=sa.Enum('active', 'inactive', name='collaborationstatus'),
               postgresql_using='status::collaborationstatus')
    
    # 3. Cleanup
    op.drop_column('collaborations', 'ngo_id')
    op.drop_column('collaborations', 'updated_at')
    
    # 4. Index for aggregation (B1-5)
    op.create_index('idx_station_readings_station_recorded', 'water_readings', ['station_id', 'recorded_at'], unique=False)


def downgrade() -> None:
    op.drop_index('idx_station_readings_station_recorded', table_name='water_readings')
    op.add_column('collaborations', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.add_column('collaborations', sa.Column('ngo_id', sa.Integer(), nullable=True))
    op.drop_constraint('fk_collaboration_station', 'collaborations', type_='foreignkey')
    op.drop_constraint('fk_collaboration_ngo_user', 'collaborations', type_='foreignkey')
    op.alter_column('collaborations', 'status', existing_type=sa.Enum('active', 'inactive', name='collaborationstatus'), type_=sa.String())
    op.drop_column('collaborations', 'contact_email')
    op.drop_column('collaborations', 'ngo_name')
    op.drop_column('collaborations', 'station_id')
    op.drop_column('collaborations', 'ngo_user_id')
    op.execute(sa.text("DROP TYPE IF EXISTS collaborationstatus"))
