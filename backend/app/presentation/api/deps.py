from __future__ import annotations

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.infrastructure.database.models.owner_profile import OwnerProfileModel
from app.infrastructure.database.models.user import UserModel

security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        sub = payload.get("sub")
        if sub is None or payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return UUID(sub)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def get_current_user(
    user_id: UUID = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
) -> UserModel:
    result = await session.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


async def require_owner(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    if current_user.is_superuser:
        return current_user
    await current_user.owner_profile  # lazy load
    from app.core.database import async_session_factory
    async with async_session_factory() as session:
        profile_result = await session.execute(
            select(OwnerProfileModel).where(OwnerProfileModel.user_id == current_user.id)
        )
        profile = profile_result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Owner access required")
    return current_user


async def require_approved_owner(current_user: UserModel = Depends(require_owner)) -> UserModel:
    from app.core.database import async_session_factory
    async with async_session_factory() as session:
        profile_result = await session.execute(
            select(OwnerProfileModel).where(OwnerProfileModel.user_id == current_user.id)
        )
        profile = profile_result.scalar_one_or_none()
    if profile and not profile.is_approved and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Owner profile not approved yet")
    return current_user


async def require_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
