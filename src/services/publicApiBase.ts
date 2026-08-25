const configuredBase = import.meta.env.VITE_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export const PUBLIC_API_BASE = configuredBase
  ?? (import.meta.env.DEV && import.meta.env.MODE !== "test" ? "/crm-api" : "https://oaksorscrm.web.app");
