export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'receptionist' | 'customer';
  nidNumber: string;
  nidImage?: string | null;
}
