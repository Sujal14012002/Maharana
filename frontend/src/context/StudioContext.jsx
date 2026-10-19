import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getStudioInfo } from "../api/studio";

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudioInfo();
      setStudio(res.data.data);
    } catch (err) {
      setError("Unable to load studio information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <StudioContext.Provider value={{ studio, loading, error, refresh }}>
      {children}
    </StudioContext.Provider>
  );
}

export const useStudio = () => useContext(StudioContext);
