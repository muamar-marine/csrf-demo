import { create } from 'zustand';

type UserData = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

type AuthState = {
  cred: string | null;
  setCred: (value: string | null) => void;
  userData: UserData | null;
  setUserData: (value: UserData | null) => void;
};

const useAuth = create<AuthState>()((set) => ({
  cred: localStorage.getItem('cred') || null,
  setCred: (cred) => set((state) => ({ ...state, cred })),
  userData: null,
  setUserData: (userData) => set((state) => ({ ...state, userData })),
}));

export { useAuth };
