export function getErrorMessage(err: unknown): string {
  if (!err) return 'Error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;

  // possible axios-like error shape
  const maybe = err as { response?: { data?: { error?: unknown } }; message?: unknown };
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
