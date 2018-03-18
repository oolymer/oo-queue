/// <reference path="tinyqueue.d.ts" />

import { queue, Queue } from "d3-queue"
import TinyQueue from "tinyqueue"

export class Worker {
  _tasks: TinyQueue
  _queue: Queue

  constructor() {
    this._tasks = new TinyQueue()
    this._queue = queue()

    for (let index = 0; index < 25; index += 1) {
      this._tasks.push({ data: index + 1 })
    }

    for (const task of this._tasks.data) {
      this._queue.defer(done => {
        this._log(task)
        done(null)
      })
    }

    // this.queue.abort()
    this._queue.awaitAll(error => {
      this._log(error)
    })
  }

  _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
  }
}
