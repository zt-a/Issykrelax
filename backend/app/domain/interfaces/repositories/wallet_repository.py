from __future__ import annotations

from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities.transaction import Transaction
from app.domain.entities.wallet import Wallet


class WalletRepository(ABC):
    @abstractmethod
    async def get_by_owner(self, owner_id: UUID) -> Wallet: ...

    @abstractmethod
    async def update(self, wallet: Wallet) -> Wallet: ...

    @abstractmethod
    async def add_transaction(self, transaction: Transaction) -> Transaction: ...

    @abstractmethod
    async def get_transactions(self, wallet_id: UUID, offset: int = 0, limit: int = 20) -> list[Transaction]: ...
