export class Scheduler {
  constructor(callback, interval) {
    this.callback = callback;
    this.isEnd = false;
    this.interval = interval;
  }

  start() {
    this.isEnd = false;
    this.play();
  }

  play() {
    setTimeout(() => {
      if (!this.$end) this.callback();
      this.play();
    }, this.interval);
  }

  end() {
    this.isEnd = true;
  }
}
