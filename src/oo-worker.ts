/// <reference path="__definitions__/tinyqueue.d.ts" />

import TinyQueue from "tinyqueue"
import PQueue from "p-queue"

export class Worker {
  _tasks: TinyQueue
  _queue: PQueue

  constructor() {
    this._tasks = new TinyQueue()
    this._queue = new PQueue({ concurrency: 1, autoStart: false })

    for (let index = 0; index < 25; index += 1) {
      this._tasks.push({ data: index + 1 })
    }

    for (const task of this._tasks.data) {
      this._queue.add(() => {
        return Promise.resolve()
      })
    }

    this._log("queue size", this._queue.size, "pending", this._queue.pending)
    this._queue.start()
    // this._queue.pause()

    this._queue.onIdle().then(() => {
      this._log("queue size", this._queue.size, "pending", this._queue.pending)
    })
  }

  _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
  }
}
