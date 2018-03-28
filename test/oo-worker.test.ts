import { Worker } from "../src/oo-worker"
import { Spies } from "./test-helpers"

describe("oo-worker", () => {
  describe("tasks", () => {
    const consoleLogSpy = Spies.consoleLog()

    afterEach(() => {
      expect(consoleLogSpy.mock.calls).toMatchSnapshot()
    })

    it("should contain tasks", done => {
      // given:
      const worker = new Worker()

      // when:
      for (let index = 0; index < 25; index += 1) {
        worker.enqueueTask({
          data: index + 1,
          action: done => setTimeout(done, 1000)
        })
      }

      // then:
      expect(worker._tasks!.length).toEqual(25)
      expect(worker._tasks!.data).toMatchSnapshot()

      // when:
      worker.prepareBatch(10)

      // then:
      expect(worker._tasks!.length).toEqual(15)
      expect(worker._queue!.size).toEqual(10)

      // expect:
      worker.processBatch()
      setTimeout(done, 1000)
    })
  })
})
