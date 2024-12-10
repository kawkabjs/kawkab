import { Response as Res } from '.';

export class Respond {
  private static buildResponse({
    status = false,
    data = null,
    message = '',
    messages = [],
    code = 'valid',
  }: {
        status?: boolean,
        data?: any,
        message?: string,
        messages?: string[],
        code?: string
    }) {
    const response: { status: boolean, code?: string, message?: string, data?: any, messages?: string[] } = {
      status,
      ...(code && { code }),
      ...(message && { message }),
      ...(data && { data }),
      ...(messages.length > 0 && { messages }),
    };
    return response;
  }

  private static formatInput(input: any) {
    if (input && typeof input === 'object' && !('code' in input || 'status' in input || 'message' in input || 'messages' in input || 'data' in input)) {
      return { data: input };
    }
    return input; 
  }

  private static sendResponse(statusCode: number, input: any = null) {
    const formattedInput = this.formatInput(input);
    const response = this.buildResponse({ status: true, ...formattedInput });
    return Res.throwJson(response, statusCode);
  }

  private static errorResponse(statusCode: number, input: any) {
    const formattedInput = this.formatInput(input);
    let status = false, data = null, message = 'Error', messages: string[] = [], code = 'invalid';

    if (typeof formattedInput === 'string') {
      message = formattedInput;
    } else {
      ({ status = false, data = null, message = 'Error', messages = [], code = 'invalid' } = formattedInput);
    }

    const response = this.buildResponse({ status, data, message, messages, code });
    return Res.throwJson(response, statusCode);
  }

  // Successful responses
  public static ok(input: any = null) { return this.sendResponse(200, input); }
  public static created(input: any = null) { return this.sendResponse(201, input); }
  public static accepted(input: any = null) { return this.sendResponse(202, input); }
  public static nonAuthoritativeInformation(input: any = null) { return this.sendResponse(203, input); }
  public static noContent() { return Res.throwJson({ status: true, code: 'valid' }, 204); }
  public static resetContent() { return Res.throwJson({ status: true, code: 'valid' }, 205); }
  public static partialContent(input: any = null) { return this.sendResponse(206, input); }
    
  // Client error responses
  public static badRequest(input: any) { return this.errorResponse(400, input); }
  public static unauthorized(input: any = null) { return this.errorResponse(401, input); }
  public static paymentRequired(input: any = null) { return this.errorResponse(402, input); }
  public static forbidden(input: any = null) { return this.errorResponse(403, input); }
  public static notFound(input: any = null) { return this.errorResponse(404, input); }
  public static methodNotAllowed(input: any = null) { return this.errorResponse(405, input); }
  public static notAcceptable(input: any = null) { return this.errorResponse(406, input); }
  public static proxyAuthenticationRequired(input: any = null) { return this.errorResponse(407, input); }
  public static requestTimeout(input: any = null) { return this.errorResponse(408, input); }
  public static conflict(input: any = null) { return this.errorResponse(409, input); }
  public static gone(input: any = null) { return this.errorResponse(410, input); }
  public static lengthRequired(input: any = null) { return this.errorResponse(411, input); }
  public static preconditionFailed(input: any = null) { return this.errorResponse(412, input); }
  public static payloadTooLarge(input: any = null) { return this.errorResponse(413, input); }
  public static uriTooLong(input: any = null) { return this.errorResponse(414, input); }
  public static unsupportedMediaType(input: any = null) { return this.errorResponse(415, input); }
  public static rangeNotSatisfiable(input: any = null) { return this.errorResponse(416, input); }
  public static expectationFailed(input: any = null) { return this.errorResponse(417, input); }
  public static teapot(input: any = null) { return this.errorResponse(418, input); }
  public static misdirectedRequest(input: any = null) { return this.errorResponse(421, input); }
  public static unprocessableEntity(input: any = null) { return this.errorResponse(422, input); }
  public static locked(input: any = null) { return this.errorResponse(423, input); }
  public static failedDependency(input: any = null) { return this.errorResponse(424, input); }
  public static upgradeRequired(input: any = null) { return this.errorResponse(426, input); }
  public static preconditionRequired(input: any = null) { return this.errorResponse(428, input); }
  public static tooManyRequests(input: any = null) { return this.errorResponse(429, input); }
  public static requestHeaderFieldsTooLarge(input: any = null) { return this.errorResponse(431, input); }
    
  // Server error responses
  public static internalServerError(input: any = null) { return this.errorResponse(500, input); }
  public static notImplemented(input: any = null) { return this.errorResponse(501, input); }
  public static badGateway(input: any) { return this.errorResponse(502, input); }
  public static serviceUnavailable(input: any) { return this.errorResponse(503, input); }
  public static gatewayTimeout(input: any = null) { return this.errorResponse(504, input); }
  public static httpVersionNotSupported(input: any = null) { return this.errorResponse(505, input); }
  public static variantAlsoNegotiates(input: any = null) { return this.errorResponse(506, input); }
  public static insufficientStorage(input: any = null) { return this.errorResponse(507, input); }
  public static loopDetected(input: any = null) { return this.errorResponse(508, input); }
  public static notExtended(input: any = null) { return this.errorResponse(510, input); }
}
