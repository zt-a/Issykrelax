from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.auth_dto import UserResponse
from app.domain.interfaces.repositories.user_repository import UserRepository
from app.infrastructure.database.models.owner_profile import OwnerProfileModel


class GetMeUseCase:
    def __init__(self, user_repo: UserRepository, session: AsyncSession) -> None:
        self._user_repo = user_repo
        self._session = session

    async def execute(self, user_id: UUID) -> UserResponse:
        user = await self._user_repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        role = user.role
        if role == "tourist":
            result = await self._session.execute(
                select(OwnerProfileModel).where(OwnerProfileModel.user_id == user_id)
            )
            if result.scalar_one_or_none():
                role = "owner"

        return UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            avatar_url=user.avatar_url,
            role=role,
            is_verified=user.is_verified,
        )
