const TIMEOUT_IN_MILLIS = 15000;

type Credentials = 'same-origin' | 'omit' | 'include' | undefined;

type Body = { [key: string]: string | number | boolean | object } | FormData;

interface Params {
  baseUrl: string;
  endpoint: string;
  token?: string;
  body?: Body;
  queryParams?: { [key: string]: string | number | boolean };
  headers?: { [key: string]: string };
  credentials?: Credentials;
  captchaToken?: string;
  timeOutInMilliseconds?: number;
  allowUnAuthorizedResponse?: boolean;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';

class Client {

  public baseUrl: string;
  public endpoint: string;
  public token?: string;
  public body?: Body;
  public queryParams: { [key: string]: string | number | boolean };
  public headers: { [key: string]: string };
  public credentials?: Credentials;
  public captchaToken?: string;
  public timeOutInMilliseconds: number;
  public allowUnAuthorizedResponse: boolean;

  constructor({
                baseUrl,
                endpoint,
                token,
                body,
                credentials = 'same-origin',
                queryParams = {},
                headers = {},
                captchaToken,
                timeOutInMilliseconds = TIMEOUT_IN_MILLIS,
                allowUnAuthorizedResponse = false,
              }: Params) {
    this.baseUrl = baseUrl;
    this.endpoint = endpoint;
    this.token = token;
    this.body = body;
    this.queryParams = queryParams;
    this.headers = headers;
    this.credentials = credentials;
    this.captchaToken = captchaToken;
    this.timeOutInMilliseconds = timeOutInMilliseconds;
    this.allowUnAuthorizedResponse = allowUnAuthorizedResponse;
  }

  public async get(): Promise<any> {
    this.headers = {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      ...this.headers,
    };
    return await this.request('GET');
  }

  public async post(): Promise<any> {
    return await this.request('POST');
  }

  public async put(): Promise<any> {
    return await this.request('PUT');
  }

  public async delete(): Promise<any> {
    return await this.request('DELETE');
  }

  public async patch(): Promise<any> {
    return await this.request('PATCH');
  }

  public async request(method: Method): Promise<any> {
    const response = await this.processRequest(method);
    return await this.handleResponse(response, method);
  }

  public async processRequest(method: Method): Promise<any> {
    const endpoint = this.getEndpoint();
    const headers = this.requestHeaders();
    return await this.sendRequest(method, endpoint, headers);
  }

  public getEndpoint(): string {
    const parameters = Object.keys(this.queryParams)
      .filter(key => this.queryParams[key] !== undefined && this.queryParams[key] !== null)
      .map(key => [key, this.queryParams[key]].map(k => encodeURIComponent(String(k))).join('='))
      .join('&');

    return parameters.length === 0
      ? `${this.baseUrl}/${this.endpoint}`
      : `${this.baseUrl}/${this.endpoint}?${parameters}`;
  }

  public requestHeaders(): any {
    const headers = !this.containsAFile()
      ? {Accept: 'application/json', ...this.headers}
      : this.headers;
    const bodyHeader = this.body && !this.containsAFile() ? {'Content-Type': 'application/json'} : {};

    return {
      ...headers,
      ...bodyHeader,
    };
  }

  public async sendRequest(method: Method, endpoint: string, headers: { [key: string]: string }): Promise<any> {
    const options = this.body ?
      {method, headers, credentials: this.credentials, body: this.createBody()}
      :
      {method, headers, credentials: this.credentials};

    return new Promise((resolve: any, reject: any) => {
      fetch(endpoint, options)
        .then((response: Response) => resolve(response))
        .catch(reject);
    })
  }

  public containsAFile(): boolean {
    return this.body instanceof FormData;
  }

  public createBody(): any {
    return this.containsAFile() ? this.body : JSON.stringify(this.body);
  }

  public async handleResponse(response: Response, method: Method): Promise<any> {
    const json = await this.parseContent(response, method);

    if (response.ok) {
      return {
        response: json,
        headers: response.headers
      };
    }

    const error = {
      content: {
        status: response.status,
        code: json.code,
        message: json.message,
        data: json.data,
      },
    };

    throw error.content;
  }

  public async parseContent(response: Response, method: Method): Promise<any> {
    try {
      if (method === 'HEAD') {
        return response.headers;
      }
      return await response.json();
    } catch (e) {
      return {};
    }
  }
}

export default Client;
