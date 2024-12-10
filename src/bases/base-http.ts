import { http as Http } from '..';

export enum HttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export abstract class BaseHttp {
  private data: any = {};

  abstract baseUrl(): string;

  abstract url(): string;

  abstract then(response: any): any;

  abstract catch(error: any): any;

  abstract finally(): any;

  method(): HttpMethodEnum {
    return HttpMethodEnum.GET;
  }

  headers(): Record<string, string | string[]> {
    return {};
  }

  body(): any {
    return {};
  }

  asForm(): boolean {
    return false;
  }

  async send(data: any = {}) {
    this.data = data;

    let http = new Http(this.baseUrl());
    const method = this.method();
    const url = this.url();
    const headers = this.headers();
    const body = this.body();

    if (this.asForm()) {
      http = http.asForm();
    }

    let request;
    switch (method) {
    case HttpMethodEnum.GET:
      request = http.get(url, { headers });
      break;
    case HttpMethodEnum.POST:
      request = http.post(url, body, { headers });
      break;
    case HttpMethodEnum.PUT:
      request = http.put(url, body, { headers });
      break;
    case HttpMethodEnum.PATCH:
      request = http.patch(url, body, { headers });
      break;
    case HttpMethodEnum.DELETE:
      request = http.delete(url, { headers });
      break;
    default:
      request = http.get(url, { headers });
    }

    return await request
      .then((response) => {
        return this.then(response);
      })
      .catch((error) => {
        return this.catch(error);
      })
      .finally(() => {
        return this.finally();
      });
  }
}
