export interface User {
  user_id: number;
  email: string;
  last_name: string;
  first_name: string;
  major?: string;
  password: string;
  role?: string;
}
