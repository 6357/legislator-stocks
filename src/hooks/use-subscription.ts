import { useState, useEffect } from "react";
import { checkProStatus } from "../lib/revenue-cat";

export function useSubscription() {
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProStatus()
      .then(setIsProUser)
      .catch(() => setIsProUser(false))
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    const isPro = await checkProStatus();
    setIsProUser(isPro);
  };

  return { isProUser, loading, refresh };
}
