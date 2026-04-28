import { useState, useEffect } from 'react';
import { listMcpTools } from '../services/stitchMcp';

export function useMcpLayout() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Lista as ferramentas disponíveis no MCP
    listMcpTools()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
