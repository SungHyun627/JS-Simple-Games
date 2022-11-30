export class Scheduler {
  constructor(callback, delay) {
    this.callback = callback;
    this.id = '';
    this.delay = delay;
  }

  start() {
    this.id = setInterval(this.callback, this.delay);
  }

  end() {
    clearInterval(this.id);
  }
}
