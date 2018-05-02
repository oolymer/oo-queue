import { Worker, Task } from "../src/oo-worker"
import { Spies } from "./test-helpers"

describe("oo-worker", () => {

  describe("task queue", () => {
    let worker: Worker
    const task1: Task = { index: 1 }
    const task2: Task = { index: 2 }

    beforeEach(() => {
      // given:
      worker = new Worker()
    })

    it ("should handle task", () => {
      // when:
      worker.queueTask(task1)

      // then:
      expect(worker.dequeueTask()).toBe(task1)
    })

    it ("should handle tasks", () => {
      // when:
      worker.queueTask(task1)
      worker.queueTask(task2)

      // then:
      expect(worker.dequeueTask()).toBe(task1)
      expect(worker.dequeueTask()).toBe(task2)
    })
  })

  describe("complex worker", () => {
    // const consoleLogSpy = Spies.consoleLog()

    // afterEach(() => {
    //   expect(consoleLogSpy.mock.calls).toMatchSnapshot()
    // })

    it("should contain tasks", done => {
      // given:
      const worker = new Worker(undefined, {
        concurrency: 5
      })

      // when:
      for (let index = 0; index < 25; index += 1) {
        worker.queueTasks({
          index: index,
          action: done => setTimeout(done, 1000)
        })
      }

      // then:
      expect(worker.numOfTasks).toEqual(25)
      expect(worker._tasks!.data).toMatchSnapshot()

      // when:
      const batch = worker.dequeueTasks(10)

      // then:
      expect(worker.numOfTasks).toEqual(15)
      expect(worker._processor!.size).toEqual(0)
      expect(worker._processor!.pending).toEqual(0)

      // when:
      const batchPromise = worker.processTasks(...batch)

      // then:
      expect(worker.numOfTasks).toEqual(15)
      expect(worker._processor!.size).toEqual(5)
      expect(worker._processor!.pending).toEqual(5)
      batchPromise.then(done)
    })

    it("should call task actions", done => {
      const worker = new Worker()

      const t1: Task = { index: 1, action: buildAction() }
      const t2: Task = { index: 2, action: buildAction() }
      const t3: Task = { index: 3, action: buildAction() }

      worker.queueTasks(t1, t2, t3)
      expect(worker.numOfTasks).toEqual(3)

      worker.processTasks(...worker.dequeueTasks(2)).then(() => {
        expect(worker.numOfTasks).toEqual(1)
        done()
      })
    })

    function buildAction(delayMillis = 100): any {
      return (done: () => {}) => {
        console.log("action!")
        setTimeout(done, delayMillis)
      }
    }
  })
})
