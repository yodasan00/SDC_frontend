
export interface User {
  user_id: number;
  username: number;
  role: 'department' | 'dit' | 'sdc'; 
}

export interface LoginResponse {
  access: string; 
  refresh: string; 
  role: string;
  username: number;
  user_id: number;
}