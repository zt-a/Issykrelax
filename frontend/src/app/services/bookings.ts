import { apiRequest } from "./api";
import type { BookingResponse, BookingListResponse } from "../types/api";

export async function createBooking(data: {
  property_id: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  special_requests?: string;
}): Promise<BookingResponse> {
  return apiRequest<BookingResponse>("/bookings", {
    method: "POST",
    body: data,
  });
}

export async function getMyBookings(params?: {
  offset?: number;
  limit?: number;
}): Promise<BookingListResponse> {
  const search = new URLSearchParams();
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<BookingListResponse>(`/bookings/my-bookings${qs ? `?${qs}` : ""}`);
}

export async function cancelBooking(id: string): Promise<BookingResponse> {
  return apiRequest<BookingResponse>(`/bookings/${id}/cancel`, { method: "POST" });
}

export async function confirmGuestCheckIn(bookingId: string): Promise<BookingResponse> {
  return apiRequest<BookingResponse>(`/bookings/${bookingId}/confirm-check-in`, { method: "POST" });
}
