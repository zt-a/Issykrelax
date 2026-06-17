from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.property import PropertyStatus
from app.infrastructure.database.models.property import PropertyModel


class ApprovePropertyUseCase:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def execute(self, property_id: UUID) -> dict[str, Any]:
        result = await self._session.execute(select(PropertyModel).where(PropertyModel.id == property_id))
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Property not found")

        model.status = PropertyStatus.PUBLISHED
        await self._session.flush()

        return {"id": str(property_id), "status": PropertyStatus.PUBLISHED}
