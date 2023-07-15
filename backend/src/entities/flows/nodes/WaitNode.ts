import { FlowNode, FlowNodeType } from '../Flow.js';

export class WaitNode extends FlowNode {
  seconds: number;

  constructor(seconds: number) {
    super(FlowNodeType.WAIT);
    this.seconds = seconds;
  }

  execute() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => resolve(), this.seconds * 1000);
    });
  }
}
