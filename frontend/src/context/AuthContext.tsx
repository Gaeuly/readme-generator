import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Tentukan tipe data untuk user yang kita dapat dari GitHub
interface IUser {
  id: string;
  displayName: string;
  username: string;
  photos: { value: string }[];
  // Tambahkan properti lain jika perlu
}

// Tentukan apa saja yang akan disediakan oleh context kita
interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
}

// Buat context-nya
const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
});

// Buat "Provider" yang akan membungkus aplikasi kita
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Saat komponen pertama kali dimuat, tanyakan ke backend siapa yang sedang login
    const checkUserStatus = async () => {
      try {
        // PENTING: `credentials: 'include'` untuk mengirim cookie sesi
        const response = await fetch('https://readme-generator-production-08d5.up.railway.app/api/auth/user', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Could not fetch user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []); // [] berarti efek ini hanya berjalan sekali saat aplikasi dimuat

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Buat custom hook agar lebih mudah digunakan di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};
