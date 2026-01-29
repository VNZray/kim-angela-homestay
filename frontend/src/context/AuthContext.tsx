import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type FirebaseUser,
} from "../utils/firebase";
import supabase from "../utils/supabase";

import type { User, UserRole } from "../types/User";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to get user role from Supabase
async function getUserRole(
  firebaseUid: string,
  email: string,
): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("firebase_uid", firebaseUid)
      .single();

    if (error || !data) {
      // User doesn't have a role yet, create default tourist role
      const { data: newRole, error: insertError } = await supabase
        .from("user_roles")
        .insert({
          firebase_uid: firebaseUid,
          email: email,
          role: "tourist",
        })
        .select("role")
        .single();

      if (insertError || !newRole) {
        console.error("Error creating user role:", insertError);
        return "tourist"; // Default fallback
      }

      return newRole.role as UserRole;
    }

    return data.role as UserRole;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "tourist"; // Default fallback
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user role from Supabase
        const role = await getUserRole(
          firebaseUser.uid,
          firebaseUser.email || "",
        );

        // Create our app's user object with role from database
        const appUser: User = {
          email: firebaseUser.email || "",
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: role,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to refresh user role (useful after role changes)
  const refreshUserRole = useCallback(async () => {
    if (firebaseUser) {
      const role = await getUserRole(
        firebaseUser.uid,
        firebaseUser.email || "",
      );
      setUser((prev) => (prev ? { ...prev, role } : null));
    }
  }, [firebaseUser]);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe = false,
    ): Promise<User> => {
      try {
        // Set persistence based on rememberMe
        await setPersistence(
          auth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence,
        );

        // Sign in with Firebase
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Fetch user role from Supabase
        const role = await getUserRole(
          credential.user.uid,
          credential.user.email || "",
        );

        const appUser: User = {
          email: credential.user.email || "",
          uid: credential.user.uid,
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL,
          rememberMe,
          role: role,
        };

        return appUser;
      } catch (error: any) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed");
      }
    },
    [],
  );

  const register = useCallback(
    async (email: string, password: string): Promise<User> => {
      try {
        // Create user with Firebase
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Fetch user role from Supabase (will be created as tourist by default)
        const role = await getUserRole(
          credential.user.uid,
          credential.user.email || "",
        );

        const appUser: User = {
          email: credential.user.email || "",
          uid: credential.user.uid,
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL,
          role: role,
        };

        return appUser;
      } catch (error: any) {
        console.error("Registration error:", error);
        throw new Error(error.message || "Registration failed");
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(async (): Promise<User> => {
    try {
      // Sign in with Google popup
      const credential = await signInWithPopup(auth, googleProvider);

      // Fetch user role from Supabase
      const role = await getUserRole(
        credential.user.uid,
        credential.user.email || "",
      );

      const appUser: User = {
        email: credential.user.email || "",
        uid: credential.user.uid,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL,
        role: role,
      };

      return appUser;
    } catch (error: any) {
      console.error("Google login error:", error);
      throw new Error(error.message || "Google login failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Logout failed");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
