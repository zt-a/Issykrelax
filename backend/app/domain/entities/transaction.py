from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4


class TransactionType:
    HOLD = "hold"
    RELEASE = "release"
    REFUND = "refund"


@dataclass
class Transaction:
    id: UUID
    wallet_id: UUID
    booking_id: UUID
    amount: Decimal
    type: str
    created_at: datetime

    @classmethod
    def create(cls, wallet_id: UUID, booking_id: UUID, amount: Decimal, type: str) -> Transaction:
        return cls(
            id=uuid4(),
            wallet_id=wallet_id,
            booking_id=booking_id,
            amount=amount,
            type=type,
            created_at=datetime.now(),
        )
