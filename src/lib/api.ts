import { ApiResponse, AuthResponse, Booking, User, Vehicle } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const request = async <T>(method: string, endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${endpoint}`, { method, headers, body: data ? JSON.stringify(data) : undefined });
  return res.json();
};

export const loginApi    = (data: { email: string; password: string }) => request<AuthResponse>('POST', '/auth/signin', data);
export const registerApi = (data: { name: string; email: string; password: string; phone: string; role?: string }) => request('POST', '/auth/signup', data);

export const getVehiclesApi   = ()                                               => request<Vehicle[]>('GET',    '/vehicles');
export const createVehicleApi = (data: any, token: string)                      => request('POST',   '/vehicles', data, token);
export const updateVehicleApi = (id: number, data: any, token: string)          => request('PUT',    `/vehicles/${id}`, data, token);
export const deleteVehicleApi = (id: number, token: string)                     => request('DELETE', `/vehicles/${id}`, undefined, token);

export const getBookingsApi   = (token: string)                                  => request<Booking[]>('GET',  '/bookings', undefined, token);
export const createBookingApi = (data: any, token: string)                      => request('POST', '/bookings', data, token);
export const updateBookingApi = (id: number, data: { status: string }, token: string) => request('PUT', `/bookings/${id}`, data, token);

export const getUsersApi   = (token: string)                                     => request<User[]>('GET',    '/users', undefined, token);
export const updateUserApi = (id: number, data: any, token: string)             => request('PUT',    `/users/${id}`, data, token);
export const deleteUserApi = (id: number, token: string)                        => request('DELETE', `/users/${id}`, undefined, token);