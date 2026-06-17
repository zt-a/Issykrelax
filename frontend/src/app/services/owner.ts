import { apiRequest } from "./api";
import type { PropertyResponse, PropertyListResponse, BookingListResponse, WalletResponse } from "../types/api";

export async function getOwnerProperties(params?: {
  offset?: number;
  limit?: number;
}): Promise<PropertyListResponse> {
  const search = new URLSearchParams();
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<PropertyListResponse>(`/owner/properties${qs ? `?${qs}` : ""}`);
}

export async function getOwnerBookings(params?: {
  offset?: number;
  limit?: number;
}): Promise<BookingListResponse> {
  const search = new URLSearchParams();
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<BookingListResponse>(`/owner/bookings${qs ? `?${qs}` : ""}`);
}

export async function getOwnerWallet(): Promise<WalletResponse> {
  return apiRequest<WalletResponse>("/owner/wallet");
}

export async function checkInBooking(verificationCode: string): Promise<void> {
  return apiRequest<void>("/owner/check-in", {
    method: "POST",
    body: { verification_code: verificationCode },
  });
}

export async function cancelOwnerBooking(bookingId: string): Promise<void> {
  return apiRequest<void>(`/owner/bookings/${bookingId}/cancel`, { method: "POST" });
}
