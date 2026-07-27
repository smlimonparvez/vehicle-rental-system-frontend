export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Vehicle {
  id: number;
  vehicle_name: string;
  type: 'car' | 'bike' | 'van' | 'SUV';
  registration_number: string;
  daily_rent_price: number | string;   // PostgreSQL returns string
  availability_status: 'available' | 'booked';
  image_url?: string | null;
}

export interface Booking {
  id: number;
  customer_id?: number;              // absent in customer-view response
  vehicle_id: number;
  rent_start_date: string | Date;    // PostgreSQL Date object or ISO string
  rent_end_date:   string | Date;
  total_price: number | string;      // PostgreSQL returns string
  status: 'active' | 'cancelled' | 'returned';
  customer?: { name: string; email: string };
  vehicle?: { vehicle_name: string; registration_number: string; type?: string };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}