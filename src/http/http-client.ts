import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';
import { HttpResponse } from './http-response';

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private isFormRequest: boolean;
  private authConfig: AxiosRequestConfig;

  constructor(baseURL?: string, headers?: Record<string, string>) {
    this.axiosInstance = axios.create({
      baseURL,
      headers
    });
    this.isFormRequest = false;
    this.authConfig = {};
  }

  public asForm(): this {
    this.isFormRequest = true;
    return this;
  }

  public withBasicAuth(username: string, password: string): this {
    this.authConfig.auth = { username, password };
    return this;
  }

  public withDigestAuth(username: string, password: string): this {
    this.authConfig.auth = { username, password };
    this.authConfig.method = 'digest';
    return this;
  }

  public withToken(token: string): this {
    this.authConfig.headers = {
      ...this.authConfig.headers,
      Authorization: `Bearer ${token}`
    };
    return this;
  }

  private handleResponse(response: AxiosResponse) {
    return new HttpResponse(response);
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      return Promise.reject(new HttpResponse(error.response));
    } else {
      return Promise.reject({ message: 'Error in setting up request', error });
    }
  }

  private getConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    config = { ...config, ...this.authConfig };
    if (this.isFormRequest) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }
    return config;
  }

  private transformData(data: any): any {
    if (this.isFormRequest) {
      return qs.stringify(data);
    }
    return data;
  }

  public async get(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get(url, this.getConfig(config))
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post(url, this.transformData(data), this.getConfig(config))
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public async put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put(url, this.transformData(data), this.getConfig(config))
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public async patch(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.patch(url, this.transformData(data), this.getConfig(config))
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public async delete(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete(url, this.getConfig(config))
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

