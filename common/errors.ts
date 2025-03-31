export class ExampleError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: unknown
  ) {
    super(message);
    this.name = "ExampleError";
  }
}

export class ValidationError extends ExampleError {
  constructor(message: string, status: number, response: unknown) {
    super(message, status, response);
    this.name = "ValidationError";
  }
}

export class ResourceNotFoundError extends ExampleError {
  constructor(resource: string) {
    super(`Resource not found: ${resource}`, 404, { message: `${resource} not found` });
    this.name = "ResourceNotFoundError";
  }
}

export class AuthenticationError extends ExampleError {
  constructor(message = "Authentication failed") {
    super(message, 401, { message });
    this.name = "AuthenticationError";
  }
}

export class PermissionError extends ExampleError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, { message });
    this.name = "PermissionError";
  }
}

export class RateLimitError extends ExampleError {
  constructor(
    message = "Rate limit exceeded",
    public readonly resetAt: Date
  ) {
    super(message, 429, { message, reset_at: resetAt.toISOString() });
    this.name = "RateLimitError";
  }
}

export class ConflictError extends ExampleError {
  constructor(message: string) {
    super(message, 409, { message });
    this.name = "ConflictError";
  }
}

export function isError(error: unknown): error is ExampleError {
  return error instanceof ExampleError;
}

export function createError(status: number, response: any): ExampleError {
  switch (status) {
    case 401:
      return new AuthenticationError(response?.message);
    case 403:
      return new PermissionError(response?.message);
    case 404:
      return new ResourceNotFoundError(response?.message || "Resource");
    case 409:
      return new ConflictError(response?.message || "Conflict occurred");
    case 422:
      return new ValidationError(
        response?.message || "Validation failed",
        status,
        response
      );
    case 429:
      return new RateLimitError(
        response?.message,
        new Date(response?.reset_at || Date.now() + 60000)
      );
    default:
      return new ExampleError(
        response?.message || "Example API error",
        status,
        response
      );
  }
}

export function formatError(error: ExampleError): string {
  let message = `Example API Error: ${error.message}`;
  
  if (error instanceof ValidationError) {
    message = `Validation Error: ${error.message}`;
    if (error.response) {
      message += `\nDetails: ${JSON.stringify(error.response)}`;
    }
  } else if (error instanceof ResourceNotFoundError) {
    message = `Not Found: ${error.message}`;
  } else if (error instanceof AuthenticationError) {
    message = `Authentication Failed: ${error.message}`;
  } else if (error instanceof PermissionError) {
    message = `Permission Denied: ${error.message}`;
  } else if (error instanceof RateLimitError) {
    message = `Rate Limit Exceeded: ${error.message}\nResets at: ${error.resetAt.toISOString()}`;
  } else if (error instanceof ConflictError) {
    message = `Conflict: ${error.message}`;
  }

  return message;
}