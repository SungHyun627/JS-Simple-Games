export class Scheduler {
  constructor(callback, interval) {
    this.callback = callback;
    this.isEnd = false;
    this.timerId = null;
    this.interval = interval;
  }

  start() {
    this.isEnd = false;
    this.play();
  }

  play() {
    setTimeout(() => {
      if (this.isEnd) {
        this.timerId = null;
        return;
      }
      if (this.timerId !== null) clearTimeout(this.timerId);
      this.timerId = this.callback();
      this.play();
    }, this.interval);
  }

  end() {
    this.isEnd = true;
  }
}
