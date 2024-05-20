import { create } from 'zustand';

const getLuminance = (colorHex: string) => {
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

type UserStore = {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  profileColor: string;
  textColor: string;
  userId: number;
  allowedDocumentNames: string[];
  role: string;
  isApprovable: 'y' | 'n';
  setName: (name: string) => void;
  setEmployeeId: (employeeId: string) => void;
  setDepartment: (department: string) => void;
  setPosition: (position: string) => void;
  setProfileColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setAllowedDocumentNames: (names: string[]) => void;
  setUserId: (userId: number) => void;
  setRole: (role: string) => void;
  setIsApprovable: (isApprovable: 'y' | 'n') => void;
};

const useUserStore = create<UserStore>((set) => ({
  name: '',
  profileColor: '',
  textColor: '',
  department: '',
  employeeId: '',
  position: '',
  userId: 0,
  allowedDocumentNames: [],
  role: '',
  isApprovable: 'n',
  setName: (name: string) => set({ name }),
  setEmployeeId: (employeeId: string) => set({ employeeId }),
  setDepartment: (department: string) => set({ department }),
  setPosition: (position: string) => set({ position }),
  setProfileColor: (color: string) => {
    const luminance = getLuminance(color);
    const textColor = luminance > 186 ? '#000000' : '#ffffff';
    set({ profileColor: color, textColor });
  },
  setTextColor: (color: string) => set({ textColor: color }),
  setAllowedDocumentNames: (names: string[]) =>
    set({ allowedDocumentNames: names }),
  setUserId: (userId: number) => set({ userId }),
  setRole: (role: string) => set({ role }),
  setIsApprovable: (isApprovable: 'y' | 'n') => set({ isApprovable }),
}));

export default useUserStore;
