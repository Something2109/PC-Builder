export function getBackendUrl(path: string) {
  return new URL(path, process.env.BACKEND_HOST);
}
