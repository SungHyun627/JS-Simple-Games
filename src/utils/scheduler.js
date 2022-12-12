export class Scheduler {
  constructor(callback, interval) {
    this.callback = callback;
    this.isEnd = false;
    this.id = null;
    this.interval = interval;
  }

  start() {
    this.isEnd = false;
    this.play();
  }

  play() {
    setTimeout(() => {
      if (this.isEnd) {
        this.id = null;
        return;
      }
      if (this.id !== null) clearTimeout(this.id);
      this.id = this.callback();
      this.play();
    }, this.interval);
  }

  end() {
    this.isEnd = true;
  }
}
