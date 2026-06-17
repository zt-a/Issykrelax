from __future__ import annotations

from uuid import UUID

from app.application.dto.booking_dto import BookingResponse
from app.domain.entities.transaction import Transaction, TransactionType
from app.domain.interfaces.repositories.booking_repository import BookingRepository
from app.domain.interfaces.repositories.wallet_repository import WalletRepository


class CancelOwnerBookingUseCase:
    def __init__(self, booking_repo: BookingRepository, wallet_repo: WalletRepository) -> None:
        self._booking_repo = booking_repo
        self._wallet_repo = wallet_repo

    async def execute(self, booking_id: UUID, owner_id: UUID) -> BookingResponse:
        booking = await self._booking_repo.get_by_id(booking_id)
        if not booking:
            raise ValueError("Booking not found")
        if booking.owner_id != owner_id:
            raise PermissionError("You can only cancel bookings for your own properties")

        if booking.status not in ("pending", "paid"):
            raise ValueError("Can only cancel pending or paid bookings")

        booking.cancel()
        await self._booking_repo.update(booking)

        wallet = await self._wallet_repo.get_by_owner(booking.owner_id)
        wallet.refund(booking.total_price)
        await self._wallet_repo.update(wallet)

        transaction = Transaction.create(
            wallet_id=wallet.id,
            booking_id=booking.id,
            amount=booking.total_price,
            type=TransactionType.REFUND,
        )
        await self._wallet_repo.add_transaction(transaction)

        return BookingResponse(
            id=str(booking.id),
            property_id=str(booking.property_id),
            guest_id=str(booking.guest_id),
            owner_id=str(booking.owner_id),
            check_in=booking.check_in.isoformat(),
            check_out=booking.check_out.isoformat(),
            total_price=float(booking.total_price),
            status=booking.status,
            guest_count=booking.guest_count,
            special_requests=booking.special_requests,
            verification_code=booking.verification_code,
            guest_confirmed=booking.guest_confirmed,
            owner_confirmed=booking.owner_confirmed,
            created_at=booking.created_at.isoformat(),
        )
