import { DateTime } from 'luxon';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { ResponseParseError } from '../errors/ResponseParseError';
import { TokenUndefinedError } from '../errors/TokenUndefinedError';
import { Account, CurrencyCode } from '../interfaces/Account';
import { Card, CardPreview } from '../interfaces/Card';
import { EventType } from '../interfaces/Event';
import { Lane, LaneRequest } from '../interfaces/Lane';
import { User } from '../interfaces/User';

type HttpMethod = 'POST' | 'GET' | 'DELETE';

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

    return `${segments.join('/')}`;
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

  getHeaderWithAuthentication(method: HttpMethod) {
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

    return this.doFetch(url, 'GET');
  }

  async updateCard({ id, lane, name, amount, closedAt }: Card) {
    let url = this.getUrl(`/api/cards/${id}`);

    return this.doFetch(url, 'POST', { lane, name, amount, closedAt });
  }

  async doFetch(url: string, method: HttpMethod, body?: any) {
    try {
      const request = body
        ? {
            ...this.getHeaderWithAuthentication(method),
            body: JSON.stringify(body),
          }
        : {
            ...this.getHeaderWithAuthentication(method),
          };

      const response = await this.fetchWithTimeout(url, request);

      try {
        const body = await response.json();

        return body as any;
      } catch (error) {
        throw new ResponseParseError(response, 'Invalid JSON document');
      }
    } catch (error) {
      throw error;
    }
  }

  async createCard(card: CardPreview) {
    let url = this.getUrl(`/api/cards`);

    return this.doFetch(url, 'POST', card);
  }

  async createComment(id: string, text: string) {
    const url = this.getUrl(`/api/cards/${id}/events`);

    return this.doFetch(url, 'POST', {
      type: EventType.Comment,
      text: text,
    });
  }

  async deleteCard(id: string) {
    const url = this.getUrl(`/api/cards/${id}`);

    return this.doFetch(url, 'DELETE');
  }

  async getLanes() {
    const url = this.getUrl(`/api/lanes`);

    return this.doFetch(url, 'GET');
  }

  async getEvents(id: string) {
    const url = this.getUrl(`/api/cards/${id}/events`);

    return this.doFetch(url, 'GET');
  }

  async updateLane(lane: Lane) {
    let url = this.getUrl(`/api/lanes/${lane.id}`);

    return this.doFetch(url, 'POST', {
      name: lane.name,
      inForecast: lane.inForecast,
      index: lane.index,
      color: lane.color,
    });
  }

  async updateLanes(lanes: LaneRequest[]) {
    let url = this.getUrl(`/api/lanes`);
    return this.doFetch(url, 'POST', lanes);
  }

  async updateAccount(id: Account['id'], currency: CurrencyCode) {
    let url = this.getUrl(`/api/accounts/${id}`);

    return this.doFetch(url, 'POST', currency);
  }

  async getUsers(): Promise<User[]> {
    const url = this.getUrl(`/api/users`);

    return this.doFetch(url, 'GET');
  }

  async createUser(name: string, password: string) {
    let url = this.getUrl(`/api/users/`);

    return this.doFetch(url, 'POST', { name, password });
  }

  async fetchForecast(start: DateTime, end: DateTime, user: string) {
    let url = this.getUrl(
      `/api/forecast?${new URLSearchParams({
        start: start.toISODate(),
        end: end.toISODate(),
        user: user,
      })}`
    );

    return this.doFetch(url, 'GET');
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
