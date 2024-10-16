export class Semaphore {
  private waitingQueue: (() => void)[] = [];

  constructor(private value: number) {}

  async wait() {
    if (this.value > 0) {
      this.value--;
    } else {
      console.assert(this.value === 0);
      await new Promise<void>(resolve => {
        this.waitingQueue.push(resolve);
      });
    }
  }

  signal() {
    if (this.waitingQueue.length > 0) {
      console.assert(this.value === 0);
      this.waitingQueue.shift()!();
    } else {
      this.value++;
    }
  }
}

export class Lock {
  private readonly semaphore = new Semaphore(1);

  async acquire() {
    await this.semaphore.wait();
  }

  release() {
    this.semaphore.signal();
  }

  async use<T>(action: () => Promise<T>): Promise<T> {
    try {
      await this.acquire();
      return await action();
    } finally {
      this.release();
    }
  }
}
