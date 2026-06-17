from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID, uuid4


class UserRole:
    USER = "tourist"
    OWNER = "owner"
    ADMIN = "admin"


@dataclass
class User:
    id: UUID
    email: str
    password_hash: str
    full_name: str
    phone: str | None
    avatar_url: str | None
    is_active: bool
    is_verified: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    @property
    def role(self) -> str:
        if self.is_superuser:
            return UserRole.ADMIN
        return UserRole.USER

    @classmethod
    def create(
        cls,
        email: str,
        password_hash: str,
        full_name: str,
        phone: str | None = None,
    ) -> User:
        now = datetime.now()
        return cls(
            id=uuid4(),
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            phone=phone,
            avatar_url=None,
            is_active=True,
            is_verified=False,
            is_superuser=False,
            created_at=now,
            updated_at=now,
        )
