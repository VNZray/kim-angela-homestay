import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Business } from "@/types/Business";
import { getBusinessById as fetchBusinessById } from "@/services/business/BusinessService";

interface BusinessContextValue {
  business: Business | null;
  loading: boolean;
  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string | null) => void;
  setBusiness: (business: Business | null) => void;
  getBusinessById: (id: string) => Promise<Business | null>;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(
  undefined,
);

interface BusinessProviderProps {
  children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null,
  );

  const getBusinessById = useCallback(
    async (id: string): Promise<Business | null> => {
      setLoading(true);
      try {
        const data = await fetchBusinessById(id);
        setBusiness(data);
        setSelectedBusinessId(id);
        return data;
      } catch (error) {
        console.error("Failed to load business by id:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        selectedBusinessId,
        setSelectedBusinessId,
        setBusiness,
        getBusinessById,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
