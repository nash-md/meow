import { FlowNode, FlowNodeType } from '../Flow.js';
import { Connector } from './Connector.js';

export class SendNode extends FlowNode {
  text: string;
  connector?: Connector;

  constructor(text: string) {
    super(FlowNodeType.SEND);
    this.text = text;
  }

  async execute() {
    if (!this.connector) {
      throw new Error();
    }

    await this.connector.send(this.text);
  }
}
