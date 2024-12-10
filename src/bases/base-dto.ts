import { request, respond, validation } from '..';

// Interface representing the DTO data structure
export interface IDTO {
  [key: string]: any;
}

export class BaseDTO {
  dto(object: object, data: IDTO): void {
    this.items(object, data);
    this.validate();
  }

  items(object: object, data: IDTO): void {
    Object.assign(object, this.data(data));
  }

  // Method to return the current instance's data
  data(i: IDTO): object {
    return {};
  }

  // Method to return field names (can be used for field translation)
  names(): { [key: string]: string } {
    return {};
  }

  // Method to define validation rules
  rules(): { [key: string]: any } {
    return {};
  }

  // Method to validate data against the defined rules
  validate() {
    const data =
      Object.keys(this).length === 0 ? request.inputs() : { ...this };
    const rules = this.rules();
    const names = this.names();

    // Call the validation check
    const validationResult = validation.check(data, rules, names);

    // If there are errors, handle them
    if (validationResult !== true) {
      return this.onError(validationResult);
    }

    return data;
  }

  // Method to handle validation errors and return a response
  onError(errors: any): any {
    return respond.badRequest({
      status: false,
      code: 'validation',
      message: errors[0],
      messages: errors,
    });
  }
}
