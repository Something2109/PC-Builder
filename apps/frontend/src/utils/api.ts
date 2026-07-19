function getBackendUrl(path: string) {
  const host = typeof process !== "undefined" ? process.env.BACKEND_HOST : undefined;
  return new URL(path, host);
}

export { getBackendUrl };
