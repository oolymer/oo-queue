/// <reference path="__definitions__/tinyqueue.d.ts" />

import TinyQueue from "tinyqueue"
import PQueue from "p-queue"

export class Worker {
  _name?: string
  _options?: WorkerOptions<Task>
  _running: boolean

  _tasks?: TinyQueue<Task>
  _queue?: PQueue

  constructor(name?: string, options?: WorkerOptions<Task>) {
    this._name = name
    this._options = options
    this._running = false

    this._initTaskPriorityQueue()
    this._initTaskProcessQueue()
  }

  private _initTaskPriorityQueue() {
    this._tasks = new TinyQueue()
  }

  private _initTaskProcessQueue() {
    this._queue = new PQueue({ concurrency: 1, autoStart: false })
  }

  enqueueTask(task: Task) {
    this._tasks!.push(task)
  }

  dequeueTasks(size: number = 1): Task[] {
    const batchTasks = []
    while (size > 0 && this._tasks!.length > 0) {
      batchTasks.push(this._tasks!.pop())
      size -= 1
    }
    return batchTasks
  }

  prepareBatch(size: number = 10): PQueue {
    const tasks = this.dequeueTasks(size)
    for (const task of tasks) {
      this._queue!.add(() => {
        return Promise.resolve()
      })
    }
    return this._queue!
  }

  processBatch() {
    // this._log("queue size", this._queue!.size, "pending", this._queue!.pending)
    this._queue!.start()
    // this._queue.pause()

    this._queue!.onIdle().then(() => {
      // this._log("queue size", this._queue!.size, "pending", this._queue!.pending)
    })
  }

  _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
  }
}

interface WorkerOptions<T> {
  comparator?: (item: T, otherItem: T) => -1 | 0 | 1

  batcher?: (queue: TinyQueue<T>) => T[]

  executor?: () => void
}

interface Task {
  data?: TaskData<any>
  action?: TaskAction
}

type TaskAction = (done: TaskDoneCallback) => void
type TaskData<T> = T
type TaskDoneCallback = () => void

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
