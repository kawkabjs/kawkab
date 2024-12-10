export class BaseMiddleware {
  public data:any;

  constructor(data: any = {}) {
    this.data = data;
    this.handle();
  }

  handle() { }
}
