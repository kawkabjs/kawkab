export abstract class BaseNotification {
  public static data:any;

  static async via(){};

  static async send(data: any = {}) {
    this.data = data;
    await this.via();
  }
}