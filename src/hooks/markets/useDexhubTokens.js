import { useEffect, useMemo, useState } from "react";

const DEXHUB_URL = "https://dexhub.mavnode.io/api/v1/prices";
const DEXHUB_KEY = "key_MSGkDgSUFyqMIKhQCZgHNKdGjmHj1kXB";

// address -> stats
function indexByAddress(list) {
  const m = new Map();
  for (const t of (list || [])) {
    const a = (t?.address || "").toLowerCase();
    if (!a) continue;
    m.set(a, t);
  }
  return m;
}

export function useDexhubTokens({ enabled = true, refreshMs = 60_000 } = {}) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    let timer = null;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const r = await fetch(DEXHUB_URL, { headers: { "X-API-Key": DEXHUB_KEY } });
        const j = await r.json();
        if (!alive) return;

        if (!j?.success) throw new Error("DexHub response not success");
        setRaw(Array.isArray(j.data) ? j.data : []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load DexHub data");
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    timer = setInterval(run, refreshMs);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [enabled, refreshMs]);

  const byAddr = useMemo(() => indexByAddress(raw), [raw]);

  return { loading, error, raw, byAddr };
}
