export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface CityResponse {
  id: string;
  name: string;
  slug: string;
  popularity_score: number;
}

export interface AmenityResponse {
  id: string;
  name: string;
  slug: string;
}

export interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  category: CategoryResponse | null;
  city: CityResponse | null;
  status: string;
  full_address: string;
  price_per_night: number;
  currency: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  check_in_time: string | null;
  check_out_time: string | null;
  instagram: string | null;
  telegram: string | null;
  whatsapp: string | null;
  amenities: string[];
  images: string[];
  owner_id: string;
  is_active: boolean;
  rating_points: number;
  stages: number;
  created_at: string;
}

export interface FavoriteResponse {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface FavoriteIdsResponse {
  favorite_ids: string[];
}

export interface PropertyListResponse {
  items: PropertyResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface BookingResponse {
  id: string;
  property_id: string;
  guest_id: string;
  owner_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  guest_count: number;
  special_requests: string | null;
  verification_code: string | null;
  guest_confirmed: boolean;
  owner_confirmed: boolean;
  created_at: string;
}

export interface BookingListResponse {
  items: BookingResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface ReviewResponse {
  id: string;
  property_id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewListResponse {
  items: ReviewResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface WalletResponse {
  available_balance: number;
  pending_balance: number;
  transactions: TransactionResponse[];
}

export interface TransactionResponse {
  id: string;
  booking_id: string;
  amount: number;
  type: string;
  created_at: string;
}

export interface AdminOwnerResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface AdminOwnerListResponse {
  items: AdminOwnerResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface AdminPropertyResponse {
  id: string;
  title: string;
  owner_id: string;
  owner_name: string;
  category: string;
  city: string;
  status: string;
  price_per_night: number;
  is_active: boolean;
  created_at: string;
}

export interface AdminPropertyListResponse {
  items: AdminPropertyResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface AdminBookingResponse {
  id: string;
  property_id: string;
  property_title: string;
  guest_id: string;
  guest_name: string;
  owner_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  guest_confirmed: boolean;
  owner_confirmed: boolean;
  verification_code: string | null;
  created_at: string;
}

export interface AdminBookingListResponse {
  items: AdminBookingResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface AdminBookingDetailResponse {
  id: string;
  property_id: string;
  property_title: string;
  property_category: string;
  property_city: string;
  property_address: string;
  property_price_per_night: number;
  property_max_guests: number;
  property_bedrooms: number;
  property_beds: number;
  property_bathrooms: number;
  property_amenities: string[];
  property_images: { url: string; is_primary: boolean }[];
  guest_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  guest_count: number;
  special_requests: string | null;
  verification_code: string | null;
  guest_confirmed: boolean;
  owner_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminPropertyDetailResponse {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  category: string;
  city: string;
  address: string;
  status: string;
  price_per_night: number;
  currency: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  check_in_time: string | null;
  check_out_time: string | null;
  amenities: string[];
  images: { url: string; is_primary: boolean }[];
  instagram: string | null;
  telegram: string | null;
  whatsapp: string | null;
  is_active: boolean;
  booking_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOwnerDetailResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  is_active: boolean;
  property_count: number;
  business_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminStatsResponse {
  total_users: number;
  total_owners: number;
  total_properties: number;
  total_bookings: number;
  total_revenue: number;
}
