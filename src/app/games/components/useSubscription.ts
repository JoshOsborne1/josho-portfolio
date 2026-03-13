"use client";

import { useState, useEffect } from "react";

export function useSubscription() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let email: string | null = null;
    try { email = localStorage.getItem("games-user-email"); } catch {}

    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`/api/subscription?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => { setIsPro(!!data.isPro); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { isPro, loading };
}
