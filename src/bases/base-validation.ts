import { validation, respond, request } from '..';

export class BaseValidation {
  constructor() {
    this.validate();
  }

  data(): object {
    return request.inputs();
  }

  inputs(): object {
    return request.inputs();
  }

  names(): { [key: string]: string } {
    return {};
  }

  rules() {
    return {};
  }

  validate() {
    const data = this.data();
    const rules = this.rules();
    const names = this.names();
    const validationResult = validation.check(data, rules, names);
    if (validationResult !== true) { return this.onError(validationResult); }
    return true;
  }

  onError(errors: any) {
    return respond.badRequest({
      status: false,
      code: 'validation',
      message: errors[0],
      messages: errors,
    });
  }
}