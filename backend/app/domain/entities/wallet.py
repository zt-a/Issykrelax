from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4


@dataclass
class Wallet:
    id: UUID
    owner_id: UUID
    available_balance: Decimal
    pending_balance: Decimal
    created_at: datetime
    updated_at: datetime

    @classmethod
    def create(cls, owner_id: UUID) -> Wallet:
        now = datetime.now()
        return cls(
            id=uuid4(),
            owner_id=owner_id,
            available_balance=Decimal("0"),
            pending_balance=Decimal("0"),
            created_at=now,
            updated_at=now,
        )

    def hold(self, amount: Decimal) -> None:
        self.pending_balance += amount
        self.updated_at = datetime.now()

    def release(self, amount: Decimal) -> None:
        self.pending_balance -= amount
        self.available_balance += amount
        self.updated_at = datetime.now()

    def refund(self, amount: Decimal) -> None:
        self.pending_balance -= amount
        self.updated_at = datetime.now()
