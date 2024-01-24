export class Queue<T> {
  private queue: T[];

  constructor() {
    this.queue = [];
  }

  enqueue = (item: T) => {
    this.queue.push(item);
  };

  dequeue = () => {
    return this.queue.shift();
  };

  toArray = () => this.queue.slice();

  isEmpty = () => this.queue.length === 0;

  clear = () => {
    this.queue = [];
  };
}
