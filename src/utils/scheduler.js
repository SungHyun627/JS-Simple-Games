export class Scheduler {
  constructor(callback, delay) {
    this.callback = callback;
    this.id = '';
    this.delay = delay;
  }

  start() {
    console.log('start');
    this.id = setInterval(this.callback, this.delay);
  }

  end() {
    console.log('end');
    clearInterval(this.id);
  }
}
