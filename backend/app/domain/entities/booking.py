from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4


class BookingStatus:
    PENDING = "pending"
    PAID = "paid"
    CHECKED_IN = "checked_in"
    CANCELLED = "cancelled"


@dataclass
class Booking:
    id: UUID
    property_id: UUID
    guest_id: UUID
    owner_id: UUID
    check_in: datetime
    check_out: datetime
    total_price: Decimal
    status: str
    guest_count: int
    special_requests: str | None
    verification_code: str | None
    created_at: datetime
    updated_at: datetime
    guest_confirmed: bool = False
    owner_confirmed: bool = False

    @classmethod
    def create(
        cls,
        property_id: UUID,
        guest_id: UUID,
        owner_id: UUID,
        check_in: datetime,
        check_out: datetime,
        total_price: Decimal,
        guest_count: int,
        verification_code: str | None = None,
        special_requests: str | None = None,
    ) -> Booking:
        now = datetime.now()
        return cls(
            id=uuid4(),
            property_id=property_id,
            guest_id=guest_id,
            owner_id=owner_id,
            check_in=check_in,
            check_out=check_out,
            total_price=total_price,
            status=BookingStatus.PENDING,
            guest_count=guest_count,
            special_requests=special_requests,
            verification_code=verification_code,
            created_at=now,
            updated_at=now,
            guest_confirmed=False,
            owner_confirmed=False,
        )

    def pay(self) -> None:
        self.status = BookingStatus.PAID
        self.updated_at = datetime.now()

    def confirm_guest(self) -> None:
        self.guest_confirmed = True
        self.updated_at = datetime.now()

    def confirm_owner(self) -> None:
        self.owner_confirmed = True
        self.updated_at = datetime.now()

    def mark_checked_in(self) -> None:
        self.status = BookingStatus.CHECKED_IN
        self.updated_at = datetime.now()

    def cancel(self) -> None:
        self.status = BookingStatus.CANCELLED
        self.updated_at = datetime.now()
