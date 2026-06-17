import { apiRequest } from "./api";
import type {
  AdminOwnerListResponse,
  AdminPropertyListResponse,
  AdminBookingListResponse,
  AdminBookingDetailResponse,
  AdminPropertyDetailResponse,
  AdminOwnerDetailResponse,
  AdminStatsResponse,
} from "../types/api";

export async function getAdminOwners(params?: {
  approved?: boolean;
  offset?: number;
  limit?: number;
}): Promise<AdminOwnerListResponse> {
  const search = new URLSearchParams();
  if (params?.approved !== undefined) search.set("approved", String(params.approved));
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<AdminOwnerListResponse>(`/admin/owners${qs ? `?${qs}` : ""}`);
}

export async function approveOwner(id: string): Promise<void> {
  return apiRequest<void>(`/admin/owners/${id}/approve`, { method: "PATCH" });
}

export async function getAdminProperties(params?: {
  status?: string;
  offset?: number;
  limit?: number;
}): Promise<AdminPropertyListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<AdminPropertyListResponse>(`/admin/properties${qs ? `?${qs}` : ""}`);
}

export async function approveProperty(id: string): Promise<void> {
  return apiRequest<void>(`/admin/properties/${id}/approve`, { method: "PATCH" });
}

export async function getAdminBookings(params?: {
  status?: string;
  offset?: number;
  limit?: number;
}): Promise<AdminBookingListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<AdminBookingListResponse>(`/admin/bookings${qs ? `?${qs}` : ""}`);
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  return apiRequest<AdminStatsResponse>("/admin/stats");
}

export async function getAdminBookingDetail(id: string): Promise<AdminBookingDetailResponse> {
  return apiRequest<AdminBookingDetailResponse>(`/admin/bookings/${id}`);
}

export async function getAdminPropertyDetail(id: string): Promise<AdminPropertyDetailResponse> {
  return apiRequest<AdminPropertyDetailResponse>(`/admin/properties/${id}`);
}

export async function getAdminOwnerDetail(id: string): Promise<AdminOwnerDetailResponse> {
  return apiRequest<AdminOwnerDetailResponse>(`/admin/owners/${id}`);
}
