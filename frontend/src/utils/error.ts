export function getErrorMessage(err: unknown): string {
  try {
    // Log técnico para depurar, no visible al usuario
    // eslint-disable-next-line no-console
    console.error('[API Error]', err);
  } catch {}

  // Formato compatible con Axios
  const ax = err as {
    response?: { status?: number; data?: { error?: unknown } };
    message?: unknown;
    code?: string;
  };

  const status = ax?.response?.status;
  const rawMsg = String(ax?.response?.data?.error ?? ax?.message ?? '');
  const msg = rawMsg.toLowerCase();

  // Mapeo a mensajes amigables por estado y texto
  if (status === 400) {
    if (msg.includes('user already exists')) return 'Este correo ya está registrado. Inicia sesión.';
    if (msg.includes('usuario ya verificado')) return 'Tu cuenta ya está verificada. Inicia sesión.';
    if (msg.includes('código de verificación inválido')) return 'El código ingresado no es válido.';
    if (msg.includes('código de verificación expirado')) return 'El código ha expirado. Solicita uno nuevo.';
    if (msg.includes('datos inválidos') || msg.includes('debe contener')) return 'Revisa los datos ingresados.';
    return 'Solicitud inválida. Revisa los datos.';
  }
  if (status === 401) {
    if (msg.includes('email no verificado')) return 'Debes verificar tu correo antes de iniciar sesión.';
    if (msg.includes('credenciales inválidas')) return 'Correo o contraseña incorrectos.';
    return 'No autorizado. Verifica tus credenciales.';
  }
  if (status === 404) return 'No encontrado.';
  if (status === 429) return 'Demasiados intentos. Intenta más tarde.';
  if (status && status >= 500) {
    if (msg.includes('error sending verification email')) {
      return 'No fue posible enviar el correo de verificación. Intenta nuevamente.';
    }
    return 'Ocurrió un problema en el servidor. Intenta más tarde.';
  }

  // Errores de red comunes
  if (msg.includes('network error') || msg.includes('failed to fetch')) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }
  if (msg.includes('timeout')) return 'La solicitud tardó demasiado. Intenta nuevamente.';

  // Fallback usando el mensaje del backend si no es técnico, o genérico
  if (ax?.response?.data?.error) {
    const plain = String(ax.response.data.error);
    if (plain && plain !== 'Internal server error') return plain;
  }
  return 'Algo salió mal. Intenta de nuevo.';
}
