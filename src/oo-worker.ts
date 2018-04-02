/// <reference path="__definitions__/tinyqueue.d.ts" />

import TinyQueue from "tinyqueue"
import PQueue from "p-queue"

export class Worker {
  _name: string
  _options: WorkerOptions<Task>

  _tasks?: TinyQueue<Task>
  _queue?: PQueue

  constructor(name: string = "default", options: WorkerOptions<Task> = {}) {
    this._name = name
    this._options = options

    this._initTaskPriorityQueue()
    this._initTaskProcessQueue()
  }

  private _initTaskPriorityQueue() {
    this._tasks = new TinyQueue()
    this._tasks.compare = this._options.comparator || (() => 0)
  }

  private _initTaskProcessQueue() {
    this._queue = new PQueue({
      concurrency: this._options.concurrency || 1,
      autoStart: false
    })
  }

  get numOfTasks(): number { return this._tasks!.length }
  pushTask(task: Task) { this._tasks!.push(task) }
  popTask(): Task { return this._tasks!.pop() }
  peekTask(): Task { return this._tasks!.peek() }

  enqueueTasks(...tasks: Task[]) {
    for (const task of tasks) {
      this.pushTask(task)
    }
  }

  dequeueTasks(numOfTasks: number = 1): Task[] {
    const batchTasks = []
    while (numOfTasks > 0 && this.numOfTasks > 0) {
      batchTasks.push(this.popTask())
      numOfTasks -= 1
    }
    return batchTasks
  }

  processTasks(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      this._queue!.add(() => {
        return Promise.resolve()
      })
    }

    this._queue!.start()
    // this._queue.pause()

    return this._queue!.onIdle()
    // return this._queue!.onEmpty()
  }

  _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
  }
}

interface WorkerOptions<T> {
  comparator?: (item: T, otherItem: T) => -1 | 0 | 1

  batcher?: (queue: TinyQueue<T>) => T[]

  executor?: () => void,

  concurrency?: number
}

export interface Task {
  index?: number,
  action?: TaskAction
}

type TaskAction = (done: TaskActionDone) => void
type TaskActionDone = (error?: any) => void
