from __future__ import annotations

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.auth_dto import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterOwnerRequest,
    RegisterUserRequest,
    TokenResponse,
    UpdateProfileRequest,
    UserResponse,
)
from app.application.use_cases.auth.change_password import ChangePasswordUseCase
from app.application.use_cases.auth.forgot_password import ForgotPasswordUseCase
from app.application.use_cases.auth.get_me import GetMeUseCase
from app.application.use_cases.auth.login_user import LoginUserUseCase
from app.application.use_cases.auth.refresh_token import RefreshTokenUseCase
from app.application.use_cases.auth.register_owner import RegisterOwnerUseCase
from app.application.use_cases.auth.register_user import RegisterUserUseCase
from app.application.use_cases.auth.update_profile import UpdateProfileUseCase
from app.core.database import get_db
from app.infrastructure.database.repositories.user_repository import SQLAlchemyUserRepository
from app.presentation.api.deps import get_current_user_id

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register-user", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(request: RegisterUserRequest, session: AsyncSession = Depends(get_db)) -> TokenResponse:
    repo = SQLAlchemyUserRepository(session)
    use_case = RegisterUserUseCase(repo)
    try:
        return await use_case.execute(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/register-owner", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_owner(request: RegisterOwnerRequest, session: AsyncSession = Depends(get_db)) -> TokenResponse:
    repo = SQLAlchemyUserRepository(session)
    use_case = RegisterOwnerUseCase(repo, session)
    try:
        return await use_case.execute(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, session: AsyncSession = Depends(get_db)) -> TokenResponse:
    repo = SQLAlchemyUserRepository(session)
    use_case = LoginUserUseCase(repo)
    try:
        return await use_case.execute(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshTokenRequest) -> TokenResponse:
    use_case = RefreshTokenUseCase()
    try:
        return await use_case.execute(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: UUID = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
) -> UserResponse:
    repo = SQLAlchemyUserRepository(session)
    use_case = GetMeUseCase(repo, session)
    try:
        return await use_case.execute(user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/me", response_model=UserResponse)
async def update_profile(
    request: UpdateProfileRequest,
    user_id: UUID = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
) -> UserResponse:
    repo = SQLAlchemyUserRepository(session)
    use_case = UpdateProfileUseCase(repo, session)
    try:
        return await use_case.execute(user_id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    repo = SQLAlchemyUserRepository(session)
    use_case = ForgotPasswordUseCase(repo)
    return await use_case.execute(request)


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    user_id: UUID = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    repo = SQLAlchemyUserRepository(session)
    use_case = ChangePasswordUseCase(repo)
    try:
        return await use_case.execute(user_id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
