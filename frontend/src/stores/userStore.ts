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
  allowedDocumentNames: string[];
  setName: (name: string) => void;
  setEmployeeId: (employeeId: string) => void;
  setDepartment: (department: string) => void;
  setPosition: (position: string) => void;
  setProfileColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setAllowedDocumentNames: (names: string[]) => void;
};

const useUserStore = create<UserStore>((set) => ({
  name: '',
  profileColor: '',
  textColor: '',
  department: '',
  employeeId: '',
  position: '',
  allowedDocumentNames: [],
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
}));

export default useUserStore;
