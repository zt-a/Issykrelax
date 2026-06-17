from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.user import User as UserEntity
from app.domain.interfaces.repositories.user_repository import UserRepository
from app.infrastructure.database.models.owner_profile import OwnerProfileModel
from app.infrastructure.database.models.user import UserModel


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, user: UserEntity) -> UserEntity:
        model = UserModel(
            id=user.id,
            email=user.email,
            password_hash=user.password_hash,
            full_name=user.full_name,
            phone=user.phone,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            is_verified=user.is_verified,
            is_superuser=user.is_superuser,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
        self._session.add(model)
        await self._session.flush()
        return user

    async def get_by_id(self, user_id: UUID) -> UserEntity | None:
        result = await self._session.execute(select(UserModel).where(UserModel.id == user_id))
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_by_email(self, email: str) -> UserEntity | None:
        result = await self._session.execute(select(UserModel).where(UserModel.email == email))
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def update(self, user: UserEntity) -> UserEntity:
        result = await self._session.execute(select(UserModel).where(UserModel.id == user.id))
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("User not found")

        model.email = user.email
        model.password_hash = user.password_hash
        model.full_name = user.full_name
        model.phone = user.phone
        model.avatar_url = user.avatar_url
        model.is_active = user.is_active
        model.is_verified = user.is_verified
        model.is_superuser = user.is_superuser
        model.updated_at = user.updated_at
        await self._session.flush()
        return user

    async def delete(self, user_id: UUID) -> None:
        result = await self._session.execute(select(UserModel).where(UserModel.id == user_id))
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()

    async def exists_by_email(self, email: str) -> bool:
        result = await self._session.execute(select(UserModel).where(UserModel.email == email))
        return result.scalar_one_or_none() is not None

    async def update_password(self, user_id: UUID, password_hash: str) -> None:
        result = await self._session.execute(select(UserModel).where(UserModel.id == user_id))
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("User not found")
        model.password_hash = password_hash
        model.updated_at = func.now()
        await self._session.flush()

    async def list_owners(self, approved: bool | None = None, offset: int = 0, limit: int = 20) -> tuple[list[UserEntity], int]:
        stmt = select(UserModel).join(OwnerProfileModel, UserModel.id == OwnerProfileModel.user_id)
        count_stmt = select(func.count()).select_from(UserModel).join(OwnerProfileModel, UserModel.id == OwnerProfileModel.user_id)

        if approved is not None:
            stmt = stmt.where(OwnerProfileModel.is_approved == approved)
            count_stmt = count_stmt.where(OwnerProfileModel.is_approved == approved)

        total_result = await self._session.execute(count_stmt)
        total = total_result.scalar() or 0

        result = await self._session.execute(stmt.order_by(UserModel.created_at.desc()).offset(offset).limit(limit))
        models = result.scalars().all()

        return [self._to_entity(m) for m in models], total

    def _to_entity(self, model: UserModel) -> UserEntity:
        return UserEntity(
            id=model.id,
            email=model.email,
            password_hash=model.password_hash,
            full_name=model.full_name,
            phone=model.phone,
            avatar_url=model.avatar_url,
            is_active=model.is_active,
            is_verified=model.is_verified,
            is_superuser=model.is_superuser,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
