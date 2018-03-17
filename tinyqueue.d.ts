declare module "tinyqueue" {

  export default class TinyQueue {
    constructor(data?: any[], compare?: Comparator)

    data: any[]
    length: number
    compare: Comparator

    push(item: any): void
    pop(): any
    peek(): any
  }

  type Comparator = (a: any, b: any) => number

}
