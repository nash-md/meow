import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { ResponseParseError } from '../errors/ResponseParseError';
import { TokenUndefinedError } from '../errors/TokenUndefinedError';
import { Card, CardPreview } from '../interfaces/Card';
import { EventType } from '../interfaces/Event';

export const stripLeadingSlash = (value: string) => {
  return value.startsWith('/') ? value.substring(1, value.length) : value;
};

export const stripTrailingSlash = (value: string) => {
  return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
};

export const strip = (value: string) => {
  let segment = value.endsWith('/') ? value.substr(0, value.length - 1) : value;
  return segment.startsWith('/') ? segment.substr(1, segment.length) : segment;
};

export class RequestHelper {
  token: string | undefined;
  url: string | undefined;

  constructor(url: string | undefined, token?: string) {
    this.url = url;
    this.token = token;
  }

  getUrl(segment?: string) {
    const segments = this.url ? [this.url] : [];

    if (segment) {
      segments.push(strip(segment));
    }

    return `${segments.join('/')}/`;
  }

  getHeaders(method: 'POST' | 'GET' | 'DELETE') {
    return {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }

  getHeaderWithAuthentication(method: 'POST' | 'GET' | 'DELETE') {
    if (!this.token) {
      throw new TokenUndefinedError();
    }

    return {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: this.token,
      },
    };
  }

  async fetchWithTimeout(
    url: string,
    request: RequestInit,
    timeout = 8000
  ): Promise<Response> {
    try {
      const controller = new AbortController();

      const id = setTimeout(() => {
        controller.abort();
      }, timeout);

      const response = await fetch(url, {
        ...request,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new RequestError(request, response, 'request failed');
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new RequestTimeoutError(error);
      } else {
        throw error;
      }
    }
  }

  parseJson = async (response: Response) => {
    try {
      const body = await response.json();

      return body as any; // TODO refactor
    } catch (error) {
      throw new ResponseParseError(response, 'Invalid JSON document');
    }
  };

  async getCards(): Promise<Card[]> {
    const url = this.getUrl(`/api/cards`);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaderWithAuthentication('GET'),
      });

      const parsed = await response.json();

      return parsed;
    } catch (error) {
      throw error;
    }
  }

  async updateCard(card: Card) {
    let url = this.getUrl(`/api/cards/${card.id}`);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaderWithAuthentication('POST'),
        body: JSON.stringify({ ...card }),
      });

      const parsed = await response?.json();

      return parsed;
    } catch (error) {
      throw error;
    }
  }

  async createCard(card: CardPreview) {
    let url = this.getUrl(`/api/cards`);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaderWithAuthentication('POST'),
        body: JSON.stringify({ ...card }),
      });

      const parsed = await response?.json();

      return parsed;
    } catch (error) {
      throw error;
    }
  }

  async createComment(id: string, text: string) {
    const url = this.getUrl(`/api/cards/${id}/events`);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaderWithAuthentication('POST'),
        body: JSON.stringify({
          type: EventType.Comment,
          text: text,
        }),
      });

      const parsed = await response.json();

      return parsed;
    } catch (error) {
      throw error;
    }
  }

  async deleteCard(id: string) {
    const url = this.getUrl(`/api/cards/${id}`);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaderWithAuthentication('DELETE'),
      });

      const parsed = await response.json();

      return parsed;
    } catch (error) {
      throw error;
    }
  }

  async getEvents(id: string) {
    const url = this.getUrl(`/api/cards/${id}/events`);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaderWithAuthentication('GET'),
      });

      const parsed = await response?.json();

      return parsed;
    } catch (error) {
      throw error;
    }
  }

  async login(name: string, password: string) {
    const url = this.getUrl(`/public/login`);

    const response = await this.fetchWithTimeout(url, {
      ...this.getHeaders('POST'),
      body: JSON.stringify({ name, password }),
    });

    const parsed = await this.parseJson(response);

    return parsed;
  }

  async register(name: string, password: string) {
    const url = this.getUrl(`/public/register`);

    const response = await this.fetchWithTimeout(url, {
      ...this.getHeaders('POST'),
      body: JSON.stringify({ name, password }),
    });

    const parsed = await this.parseJson(response);

    return parsed;
  }

  isValidToken = async (token: string): Promise<any> => {
    const url = this.getUrl('/public/validate-token');

    const response = await this.fetchWithTimeout(url, {
      ...this.getHeaders('POST'),
      body: JSON.stringify({ token }),
    });

    const parsed = await this.parseJson(response);

    return parsed;
  };
}
