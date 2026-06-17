from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.auth_dto import RegisterOwnerRequest, TokenResponse
from app.core.security import create_access_token, create_refresh_token, hash_password
from app.domain.entities.owner_profile import OwnerProfile
from app.domain.entities.user import User
from app.domain.interfaces.repositories.user_repository import UserRepository
from app.infrastructure.database.models.owner_profile import OwnerProfileModel


class RegisterOwnerUseCase:
    def __init__(self, user_repo: UserRepository, session: AsyncSession) -> None:
        self._user_repo = user_repo
        self._session = session

    async def execute(self, request: RegisterOwnerRequest) -> TokenResponse:
        exists = await self._user_repo.exists_by_email(request.email)
        if exists:
            raise ValueError("User with this email already exists")

        user = User.create(
            email=request.email,
            password_hash=hash_password(request.password),
            full_name=request.full_name,
            phone=request.phone,
        )
        await self._user_repo.create(user)

        profile = OwnerProfile.create(
            user_id=user.id,
            business_phone=request.business_phone,
        )
        model = OwnerProfileModel(
            id=profile.id,
            user_id=profile.user_id,
            is_approved=profile.is_approved,
            business_phone=profile.business_phone,
            created_at=profile.created_at,
        )
        self._session.add(model)
        await self._session.flush()

        return TokenResponse(
            access_token=create_access_token(subject=str(user.id)),
            refresh_token=create_refresh_token(subject=str(user.id)),
        )
