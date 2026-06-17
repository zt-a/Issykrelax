from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class AdminOwnerResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None = None
    is_approved: bool = False
    created_at: str

    model_config = {"from_attributes": True}


class AdminOwnerListResponse(BaseModel):
    items: list[AdminOwnerResponse]
    total: int
    offset: int
    limit: int


class AdminPropertyResponse(BaseModel):
    id: str
    title: str
    owner_id: str
    owner_name: str = ""
    category: str = ""
    city: str = ""
    status: str
    price_per_night: float
    rating_points: int = 0
    stages: int = 0
    is_active: bool
    created_at: str

    model_config = {"from_attributes": True}


class AdminPropertyListResponse(BaseModel):
    items: list[AdminPropertyResponse]
    total: int
    offset: int
    limit: int


class AdminBookingResponse(BaseModel):
    id: str
    property_id: str
    property_title: str = ""
    guest_id: str
    guest_name: str = ""
    owner_id: str
    check_in: str
    check_out: str
    total_price: float
    status: str
    guest_confirmed: bool = False
    owner_confirmed: bool = False
    verification_code: str | None = None
    created_at: str

    model_config = {"from_attributes": True}


class AdminBookingListResponse(BaseModel):
    items: list[AdminBookingResponse]
    total: int
    offset: int
    limit: int


class AdminBookingDetailResponse(BaseModel):
    id: str
    property_id: str
    property_title: str = ""
    property_category: str = ""
    property_city: str = ""
    property_address: str = ""
    property_price_per_night: float = 0
    property_max_guests: int = 0
    property_bedrooms: int = 0
    property_beds: int = 0
    property_bathrooms: int = 0
    property_amenities: list[str] = []
    property_images: list[dict[str, Any]] = []
    guest_id: str
    guest_name: str = ""
    guest_email: str = ""
    guest_phone: str | None = None
    owner_id: str
    owner_name: str = ""
    owner_email: str = ""
    owner_phone: str | None = None
    check_in: str
    check_out: str
    total_price: float
    status: str
    guest_count: int = 1
    special_requests: str | None = None
    verification_code: str | None = None
    guest_confirmed: bool = False
    owner_confirmed: bool = False
    created_at: str
    updated_at: str


class AdminPropertyDetailResponse(BaseModel):
    id: str
    title: str
    description: str = ""
    owner_id: str
    owner_name: str = ""
    owner_email: str = ""
    category: str = ""
    city: str = ""
    address: str = ""
    status: str
    price_per_night: float
    currency: str = "KGS"
    max_guests: int
    bedrooms: int = 1
    beds: int = 1
    bathrooms: int = 1
    check_in_time: str | None = None
    check_out_time: str | None = None
    amenities: list[str] = []
    images: list[dict[str, Any]] = []
    instagram: str | None = None
    telegram: str | None = None
    whatsapp: str | None = None
    rating_points: int = 0
    stages: int = 0
    is_active: bool = True
    booking_count: int = 0
    created_at: str
    updated_at: str


class AdminOwnerDetailResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None = None
    avatar_url: str | None = None
    is_approved: bool = False
    is_active: bool = True
    property_count: int = 0
    business_phone: str | None = None
    created_at: str
    updated_at: str


class RatingAdjustRequest(BaseModel):
    points: int


class AdminStatsResponse(BaseModel):
    total_users: int
    total_owners: int
    total_properties: int
    total_bookings: int
    total_revenue: float
