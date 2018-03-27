declare module "tinyqueue" {

  export default class TinyQueue<T> {
    constructor(data?: T[], compare?: Comparator<T>)

    data: T[]
    length: number
    compare: Comparator<T>

    push(item: T): void
    pop(): T
    peek(): T
  }

  type Comparator<T> = (a: T, b: T) => number

}
