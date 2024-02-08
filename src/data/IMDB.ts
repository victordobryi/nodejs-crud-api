interface Transaction {
  id: string;
  changes: { [key: string]: any };
}

export class InMemoryDB {
  private store: { [key: string]: any };
  private transactionStack: Transaction[];

  constructor() {
    this.store = {};
    this.transactionStack = [];
  }

  get(key: string): any {
    return this.store[key] || null;
  }

  save(key: string, value: any): void {
    this.trackChange(key);
    this.store[key] = value;
  }

  delete(key: string): void {
    this.trackChange(key);
    delete this.store[key];
  }

  exists(key: string): boolean {
    return key in this.store;
  }

  getAll(): { [key: string]: any } {
    return this.store;
  }

  clear(): void {
    this.store = {};
  }

  trackChange(key: string) {
    if (this.transactionStack.length > 0) {
      const transaction = this.transactionStack[this.transactionStack.length - 1];
      if (!(key in transaction.changes)) {
        transaction.changes[key] = this.store[key] || null;
      }
    }
  }

  beginTransaction() {
    const transaction = { id: String(Date.now()), changes: {} };
    this.transactionStack.push(transaction);
    return transaction.id;
  }

  commitTransaction(transactionId: string) {
    const transactionIndex = this.transactionStack.findIndex((t) => t.id === transactionId);
    if (transactionIndex !== -1) {
      this.transactionStack = this.transactionStack.slice(0, transactionIndex);
    } else {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }
  }

  rollbackTransaction(transactionId: string) {
    const transactionIndex = this.transactionStack.findIndex((t) => t.id === transactionId);
    if (transactionIndex !== -1) {
      const transaction = this.transactionStack[transactionIndex];
      for (let key in transaction.changes) {
        if (transaction.changes[key] === null) {
          delete this.store[key];
        } else {
          this.store[key] = transaction.changes[key];
        }
      }
      this.transactionStack = this.transactionStack.slice(0, transactionIndex);
    } else {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }
  }
}
