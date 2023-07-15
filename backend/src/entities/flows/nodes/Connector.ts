export interface Connector {
  send(text: string): Promise<string | boolean | void>;
}
