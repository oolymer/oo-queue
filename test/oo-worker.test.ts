import { Worker } from "../src/oo-worker"

describe("oo-worker", () => {
  describe("tasks", () => {
    it("should contain tasks", () => {
      const worker = new Worker()
      expect(worker._tasks.data).toMatchSnapshot()
    })
  })
})
