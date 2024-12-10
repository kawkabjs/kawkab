export abstract class Res {
  public static throwJson(json: any, statusCode: number = 200, init?: ResponseInit): void {}

  // Function for ok responses
  public static ok(value: any, init?: ResponseInit) {
    return this.throwJson(value, 200, init);
  }

  // Function for created responses
  public static created(value: any, init?: ResponseInit) {
    return this.throwJson(value, 201, init);
  }

  // Function for accepted responses
  public static accepted(value: any, init?: ResponseInit) {
    return this.throwJson(value, 202, init);
  }

  // Function for no content responses
  public static noContent(init?: ResponseInit) {
    return this.throwJson(null, 204, init);
  }

  // Function for bad request responses
  public static badRequest(value: any, init?: ResponseInit) {
    return this.throwJson(value, 400, init);
  }

  // Function for unauthorized responses
  public static unauthorized(value: any, init?: ResponseInit) {
    return this.throwJson(value, 401, init);
  }

  // Function for forbidden responses
  public static forbidden(value: any, init?: ResponseInit) {
    return this.throwJson(value, 403, init);
  }

  // Function for not found responses
  public static notFound(value: any, init?: ResponseInit) {
    return this.throwJson(value, 404, init);
  }

  // Function for method not allowed responses
  public static methodNotAllowed(value: any, init?: ResponseInit) {
    return this.throwJson(value, 405, init);
  }

  // Function for not acceptable responses
  public static notAcceptable(value: any, init?: ResponseInit) {
    return this.throwJson(value, 406, init);
  }

  // Function for conflict responses
  public static conflict(value: any, init?: ResponseInit) {
    return this.throwJson(value, 409, init);
  }

  // Function for gone responses
  public static gone(value: any, init?: ResponseInit) {
    return this.throwJson(value, 410, init);
  }

  // Function for unprocessable entity responses
  public static unprocessableEntity(value: any, init?: ResponseInit) {
    return this.throwJson(value, 422, init);
  }

  // Function for too many requests responses
  public static tooManyRequests(value: any, init?: ResponseInit) {
    return this.throwJson(value, 429, init);
  }

  // Function for internal server error responses
  public static internalServerError(value: any, init?: ResponseInit) {
    return this.throwJson(value, 500, init);
  }

  // Function for not implemented responses
  public static notImplemented(value: any, init?: ResponseInit) {
    return this.throwJson(value, 501, init);
  }

  // Function for bad gateway responses
  public static badGateway(value: any, init?: ResponseInit) {
    return this.throwJson(value, 502, init);
  }

  // Function for service unavailable responses
  public static serviceUnavailable(value: any, init?: ResponseInit) {
    return this.throwJson(value, 503, init);
  }

  // Function for gateway timeout responses
  public static gatewayTimeout(value: any, init?: ResponseInit) {
    return this.throwJson(value, 504, init);
  }
}