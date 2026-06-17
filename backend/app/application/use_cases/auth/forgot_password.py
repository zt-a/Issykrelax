from __future__ import annotations

from typing import Any

from app.application.dto.auth_dto import ForgotPasswordRequest
from app.domain.interfaces.repositories.user_repository import UserRepository


class ForgotPasswordUseCase:
    def __init__(self, user_repo: UserRepository) -> None:
        self._user_repo = user_repo

    async def execute(self, request: ForgotPasswordRequest) -> dict[str, Any]:
        user = await self._user_repo.get_by_email(request.email)
        if not user:
            return {"message": "Если email зарегистрирован, инструкции отправлены на почту"}
        return {"message": "Если email зарегистрирован, инструкции отправлены на почту"}
