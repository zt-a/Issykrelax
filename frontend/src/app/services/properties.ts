import { apiRequest } from "./api";
import type {
  CategoryResponse,
  CityResponse,
  AmenityResponse,
  PropertyResponse,
  PropertyListResponse,
} from "../types/api";

export async function getCategories(): Promise<CategoryResponse[]> {
  return apiRequest<CategoryResponse[]>("/properties/categories");
}

export async function getCities(): Promise<CityResponse[]> {
  return apiRequest<CityResponse[]>("/properties/cities");
}

export async function getAmenities(): Promise<AmenityResponse[]> {
  return apiRequest<AmenityResponse[]>("/properties/amenities");
}

export async function getProperties(params?: {
  query?: string;
  category_id?: string;
  city_id?: string;
  min_price?: number;
  max_price?: number;
  max_guests?: number;
  amenities?: string;
  sort_by?: string;
  offset?: number;
  limit?: number;
}): Promise<PropertyListResponse> {
  const search = new URLSearchParams();
  if (params?.query) search.set("query", params.query);
  if (params?.category_id) search.set("category_id", params.category_id);
  if (params?.city_id) search.set("city_id", params.city_id);
  if (params?.min_price !== undefined) search.set("min_price", String(params.min_price));
  if (params?.max_price !== undefined) search.set("max_price", String(params.max_price));
  if (params?.max_guests !== undefined) search.set("max_guests", String(params.max_guests));
  if (params?.amenities) search.set("amenities", params.amenities);
  if (params?.sort_by) search.set("sort_by", params.sort_by);
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiRequest<PropertyListResponse>(`/properties${qs ? `?${qs}` : ""}`);
}

export async function getProperty(id: string): Promise<PropertyResponse> {
  return apiRequest<PropertyResponse>(`/properties/${id}`);
}

export async function createProperty(data: {
  title: string;
  description: string;
  category_id: string;
  city_id: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities?: string[];
  images?: string[];
}): Promise<PropertyResponse> {
  return apiRequest<PropertyResponse>("/properties", {
    method: "POST",
    body: data,
  });
}

export async function updateProperty(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price_per_night: number;
    max_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    is_active: boolean;
  }>
): Promise<PropertyResponse> {
  return apiRequest<PropertyResponse>(`/owner/properties/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteProperty(id: string): Promise<void> {
  return apiRequest<void>(`/owner/properties/${id}`, { method: "DELETE" });
}
