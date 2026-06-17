from __future__ import annotations

from redis.asyncio import ConnectionPool, Redis

from app.core.config import settings

redis_pool = ConnectionPool.from_url(
    settings.REDIS_URL,
    decode_responses=True,
)


async def get_redis() -> Redis:
    return Redis(connection_pool=redis_pool)
