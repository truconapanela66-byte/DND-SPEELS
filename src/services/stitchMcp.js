// Usa o proxy local do Vite para evitar CORS
const STITCH_URL = "/api/mcp";
const API_KEY = import.meta.env.VITE_STITCH_API_KEY;

// Função auxiliar para fazer requisições JSON-RPC ao servidor MCP
async function mcpRequest(method, params = {}) {
  const headers = {
    "X-Goog-Api-Key": API_KEY,
    "Content-Type": "application/json",
    "Accept": "*/*",
    "X-Browser-Channel": "stable",
    "X-Browser-Copyright": "Copyright 2026 Google LLC. All Rights Reserved.",
    "X-Browser-Year": "2026",
  };
  
  const body = {
    jsonrpc: "2.0",
    id: Date.now(),
    method,
    params,
  };

  console.log('MCP Request:', { url: STITCH_URL, method, params, apiKey: API_KEY ? '***' : 'MISSING' });

  const response = await fetch(STITCH_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  console.log('MCP Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('MCP Error response:', errorText);
    throw new Error(`Erro MCP: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('MCP Response data:', data);
  
  if (data.error) {
    throw new Error(`Erro MCP: ${data.error.message || JSON.stringify(data.error)}`);
  }

  return data.result;
}

// Lista todos os recursos disponíveis no servidor MCP
export async function listMcpResources() {
  return mcpRequest("resources/list");
}

// Lê um recurso específico
export async function readMcpResource(uri) {
  return mcpRequest("resources/read", { uri });
}

// Lista todas as ferramentas disponíveis
export async function listMcpTools() {
  return mcpRequest("tools/list");
}

// Chama uma ferramenta específica
export async function callMcpTool(name, arguments_) {
  return mcpRequest("tools/call", { name, arguments: arguments_ });
}

// Função legada para compatibilidade
export async function fetchMcpLayout(resource, options = {}) {
  // Tenta listar recursos primeiro
  return listMcpResources();
}
