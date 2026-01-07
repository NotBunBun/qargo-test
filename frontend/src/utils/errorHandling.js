export const extractApiError = (error, defaultMessage) => {
  if (!error.response?.data) return defaultMessage;

  const { data } = error.response;

  if (typeof data === 'string') return data;

  if (data.detail) return data.detail;

  const fieldErrors = ['email', 'password', 'username', 'password2'];
  for (const field of fieldErrors) {
    if (data[field]?.[0]) return data[field][0];
  }

  return defaultMessage;
};

export const handleAuthError = (error, context) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  return extractApiError(error, `Error en ${context}`);
};
