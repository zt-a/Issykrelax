from __future__ import annotations

from uuid import UUID

from app.application.dto.booking_dto import BookingResponse
from app.domain.entities.transaction import Transaction, TransactionType
from app.domain.interfaces.repositories.booking_repository import BookingRepository
from app.domain.interfaces.repositories.property_repository import PropertyRepository
from app.domain.interfaces.repositories.wallet_repository import WalletRepository


class GuestCheckInUseCase:
    def __init__(
        self,
        booking_repo: BookingRepository,
        wallet_repo: WalletRepository,
        property_repo: PropertyRepository,
    ) -> None:
        self._booking_repo = booking_repo
        self._wallet_repo = wallet_repo
        self._property_repo = property_repo

    async def execute(self, booking_id: UUID, guest_id: UUID) -> BookingResponse:
        booking = await self._booking_repo.get_by_id(booking_id)
        if not booking:
            raise ValueError("Booking not found")

        if booking.guest_id != guest_id:
            raise PermissionError("This booking does not belong to you")

        if booking.status != "paid":
            raise ValueError("Booking cannot be checked in")

        booking.confirm_guest()

        both_confirmed = booking.guest_confirmed and booking.owner_confirmed
        if both_confirmed:
            booking.mark_checked_in()
            await self._property_repo.add_rating_points(booking.property_id, 1)
            wallet = await self._wallet_repo.get_by_owner(booking.owner_id)
            wallet.release(booking.total_price)
            await self._wallet_repo.update(wallet)

            transaction = Transaction.create(
                wallet_id=wallet.id,
                booking_id=booking.id,
                amount=booking.total_price,
                type=TransactionType.RELEASE,
            )
            await self._wallet_repo.add_transaction(transaction)

        await self._booking_repo.update(booking)

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
