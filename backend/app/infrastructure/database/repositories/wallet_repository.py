from __future__ import annotations

from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.transaction import Transaction as TransactionEntity
from app.domain.entities.wallet import Wallet as WalletEntity
from app.domain.interfaces.repositories.wallet_repository import WalletRepository
from app.infrastructure.database.models.transaction import TransactionModel
from app.infrastructure.database.models.wallet import WalletModel


class SQLAlchemyWalletRepository(WalletRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_owner(self, owner_id: UUID) -> WalletEntity:
        result = await self._session.execute(select(WalletModel).where(WalletModel.owner_id == owner_id))
        model = result.scalar_one_or_none()
        if model:
            return self._to_entity(model)
        wallet = WalletEntity.create(owner_id)
        await self._create_model(wallet)
        return wallet

    async def update(self, wallet: WalletEntity) -> WalletEntity:
        result = await self._session.execute(select(WalletModel).where(WalletModel.id == wallet.id))
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Wallet not found")

        model.available_balance = float(wallet.available_balance)
        model.pending_balance = float(wallet.pending_balance)
        model.updated_at = wallet.updated_at
        await self._session.flush()
        return wallet

    async def add_transaction(self, transaction: TransactionEntity) -> TransactionEntity:
        model = TransactionModel(
            id=transaction.id,
            wallet_id=transaction.wallet_id,
            booking_id=transaction.booking_id,
            amount=float(transaction.amount),
            type=transaction.type,
            created_at=transaction.created_at,
        )
        self._session.add(model)
        await self._session.flush()
        return transaction

    async def get_transactions(self, wallet_id: UUID, offset: int = 0, limit: int = 20) -> list[TransactionEntity]:
        result = await self._session.execute(
            select(TransactionModel)
            .where(TransactionModel.wallet_id == wallet_id)
            .order_by(TransactionModel.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return [self._to_transaction_entity(m) for m in result.scalars().all()]

    async def _create_model(self, wallet: WalletEntity) -> None:
        model = WalletModel(
            id=wallet.id,
            owner_id=wallet.owner_id,
            available_balance=float(wallet.available_balance),
            pending_balance=float(wallet.pending_balance),
            created_at=wallet.created_at,
            updated_at=wallet.updated_at,
        )
        self._session.add(model)
        await self._session.flush()

    def _to_entity(self, model: WalletModel) -> WalletEntity:
        return WalletEntity(
            id=model.id,
            owner_id=model.owner_id,
            available_balance=Decimal(str(model.available_balance)),
            pending_balance=Decimal(str(model.pending_balance)),
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_transaction_entity(self, model: TransactionModel) -> TransactionEntity:
        return TransactionEntity(
            id=model.id,
            wallet_id=model.wallet_id,
            booking_id=model.booking_id,
            amount=Decimal(str(model.amount)),
            type=model.type,
            created_at=model.created_at,
        )
