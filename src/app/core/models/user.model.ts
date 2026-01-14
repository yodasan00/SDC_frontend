// src/app/core/models/user.model.ts

export interface User {
  user_id: number;
  username: number;
  role: 'department' | 'dit' | 'sdc'; // Strict typing for roles
}

export interface LoginResponse {
  access: string;  // The JWT Access Token
  refresh: string; // The Refresh Token
  role: string;
  username: number;
  user_id: number;
}