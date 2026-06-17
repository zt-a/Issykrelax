import { apiRequest } from "./api";
import type { FavoriteResponse, FavoriteIdsResponse, PropertyListResponse } from "../types/api";

export async function addFavorite(propertyId: string): Promise<FavoriteResponse> {
  return apiRequest<FavoriteResponse>("/favorites", {
    method: "POST",
    body: { property_id: propertyId },
  });
}

export async function removeFavorite(propertyId: string): Promise<void> {
  return apiRequest<void>(`/favorites/${propertyId}`, {
    method: "DELETE",
  });
}

export async function getFavoriteIds(): Promise<FavoriteIdsResponse> {
  return apiRequest<FavoriteIdsResponse>("/favorites/ids");
}

export async function getFavoriteProperties(params?: {
  offset?: number;
  limit?: number;
}): Promise<PropertyListResponse> {
  const search = new URLSearchParams();
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<PropertyListResponse>(`/favorites/properties${qs ? `?${qs}` : ""}`);
}
