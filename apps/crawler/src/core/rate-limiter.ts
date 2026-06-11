export class HostRateLimiter {
  private activeLocks = new Map<string, Promise<void>>();

  async wait(url: URL, delayMs = 1000): Promise<void> {
    const host = url.hostname;
    const currentPromise = this.activeLocks.get(host) || Promise.resolve();

    let resolveLock: () => void = () => {};
    const nextPromise = new Promise<void>((resolve) => {
      resolveLock = resolve;
    });

    this.activeLocks.set(host, nextPromise);

    await currentPromise;

    // Apply the delay with 20% random jitter
    const jitter = 0.8 + Math.random() * 0.4;
    const finalDelay = delayMs * jitter;

    await new Promise((resolve) => setTimeout(resolve, finalDelay));
    resolveLock();
  }
}
