import { AxiosError } from 'axios';

export function getErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    if (err.response && err.response.data) {
      const data = err.response.data as { error?: unknown };
      if (data.error) return String(data.error);
    }
  }

  if (!err) return 'Error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;

  const maybe = err as {
    response?: { data?: { error?: unknown } };
    message?: unknown;
  };
  if (maybe.response && maybe.response.data && maybe.response.data.error) {
    return String(maybe.response.data.error);
  }
  if (maybe.message) return String(maybe.message);
  try {
    return String(err);
  } catch {
    return 'Error';
  }
}
