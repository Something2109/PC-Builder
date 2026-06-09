export function getBackendPath(path: string) {
  return new URL(path, process.env.NEXT_PUBLIC_BACKEND_HOST);
}
