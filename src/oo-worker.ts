/// <reference path="__definitions__/tinyqueue.d.ts" />

import TinyQueue from "tinyqueue"
import PQueue from "p-queue"

export class Worker {
  _name?: string
  _options?: WorkerOptions

  _tasks?: TinyQueue<any>
  _queue?: PQueue

  constructor(name?: string, options?: WorkerOptions) {
    this._name = name
    this._options = options

    this._initTaskPriorityQueue()
    this._initTaskProcessQueue()
    this.prepare()
  }

  private _initTaskPriorityQueue() {
    this._tasks = new TinyQueue()
  }

  private _initTaskProcessQueue() {
    this._queue = new PQueue({ concurrency: 1, autoStart: false })
  }

  prepare() {
    for (let index = 0; index < 25; index += 1) {
      this._tasks!.push({ data: index + 1 })
    }

    for (const task of this._tasks!.data) {
      this._queue!.add(() => {
        return Promise.resolve()
      })
    }
  }

  process() {
    this._log("queue size", this._queue!.size, "pending", this._queue!.pending)
    this._queue!.start()
    // this._queue.pause()

    this._queue!.onIdle().then(() => {
      this._log("queue size", this._queue!.size, "pending", this._queue!.pending)
    })
  }

  _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
  }
}

interface WorkerOptions {
  comparator?: (task1: any, task2: any) => number,

  batcher?: (queue: TinyQueue<any>) => any[],

  executor?: () => void
}

function _require(condition: boolean, lazyMessage?: () => string) {
  if (!condition) {
    if (lazyMessage) {
      throw lazyMessage()
    }
    throw "illegal argument"
  }
}

function _requireNotNil(value: any, lazyMessage?: () => string) {
  if (_isNil(value)) {
    if (lazyMessage) {
      throw lazyMessage()
    }
    throw "illegal argument"
  }
}

function _isNil(value: any): boolean {
  return value === null || value === undefined
}
