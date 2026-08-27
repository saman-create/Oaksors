export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors: Record<string, string>;

  constructor(message: string, options: { status?: number; code?: string; fieldErrors?: Record<string, string> } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 0;
    this.code = options.code ?? "network_error";
    this.fieldErrors = options.fieldErrors ?? {};
  }
}
