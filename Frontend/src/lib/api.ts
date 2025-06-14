import axios from "axios";

// Cria uma instância do axios com a URL base da API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://meu-frontend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepta as requisições para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  // Obtém o token do localStorage
  const token = localStorage.getItem("token");

  // Se o token existir, adiciona ao cabeçalho da requisição
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function apiTest() {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    return error;
  }
}
