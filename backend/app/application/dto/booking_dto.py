from __future__ import annotations

from datetime import date

from pydantic import BaseModel


class CreateBookingRequest(BaseModel):
    property_id: str
    check_in: date
    check_out: date
    guest_count: int
    special_requests: str | None = None


class BookingResponse(BaseModel):
    id: str
    property_id: str
    guest_id: str
    owner_id: str
    check_in: str
    check_out: str
    total_price: float
    status: str
    guest_count: int
    special_requests: str | None = None
    verification_code: str | None = None
    guest_confirmed: bool = False
    owner_confirmed: bool = False
    created_at: str

    model_config = {"from_attributes": True}


class BookingListResponse(BaseModel):
    items: list[BookingResponse]
    total: int
    offset: int
    limit: int


class CheckInRequest(BaseModel):
    verification_code: str
