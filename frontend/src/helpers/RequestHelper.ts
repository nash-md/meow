import { DateTime } from 'luxon';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { ResponseParseError } from '../errors/ResponseParseError';
import { TokenUndefinedError } from '../errors/TokenUndefinedError';
import { Account, AccountPreview } from '../interfaces/Account';
import { Card, CardPreview } from '../interfaces/Card';
import { EventType } from '../interfaces/Event';
import { Lane, LaneRequest } from '../interfaces/Lane';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode, Integration, Team } from '../interfaces/Team';
import { User } from '../interfaces/User';
import { FilterMode } from '../pages/HomePage';

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

    return `${segments.join('/')}`; // TODO migrate to URL class
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

  async updateCard({
    id,
    laneId,
    name,
    amount,
    closedAt,
    nextFollowUpAt,
    userId,
    attributes,
    status,
  }: Card) {
    let url = this.getUrl(`/api/cards/${id}`);

    return this.doFetch(url, 'POST', {
      laneId,
      name,
      amount,
      closedAt,
      nextFollowUpAt,
      userId,
      attributes,
      status,
    });
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

  async createCard(card: CardPreview): Promise<Card> {
    let url = this.getUrl(`/api/cards`);

    return this.doFetch(url, 'POST', card);
  }

  async createEvent(id: string, entity: 'card' | 'account', text: string) {
    const url = this.getUrl(`/api/events/${id}`);

    return this.doFetch(url, 'POST', {
      type: EventType.CommentCreated,
      text: text,
      entity: entity,
    });
  }

  async getEvents(id: string) {
    const url = this.getUrl(`/api/events/${id}`);

    return this.doFetch(url, 'GET');
  }

  async getLanes() {
    const url = this.getUrl(`/api/lanes`);

    return this.doFetch(url, 'GET');
  }

  async getLanesStatistic(filter?: Set<FilterMode>, text?: string) {
    let url = undefined;

    // TODO refactor
    if (!this.url) {
      url = new URL(this.getUrl(`/api/lanes/statistic`));
    } else {
      url = new URL(
        `${window.location.protocol}//${window.location.host}${this.getUrl(
          `/api/lanes/statistic`
        )}`
      );
    }

    if (filter && filter.size > 0) {
      const list = Array.from(filter).map((mode) => mode.toString());

      url.searchParams.append('filter', list.join(','));
    }

    if (text) {
      url.searchParams.append('text', text);
    }

    return this.doFetch(url.toString(), 'GET');
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

  async updateTeam(id: Team['id'], currency: CurrencyCode) {
    let url = this.getUrl(`/api/teams/${id}`);

    return this.doFetch(url, 'POST', { currency: currency });
  }

  async updateIntegration(id: Team['id'], integration: Integration) {
    let url = this.getUrl(`/api/teams/${id}/integrations`);

    return this.doFetch(url, 'POST', integration);
  }

  async getTeam(id: Team['id']): Promise<Team> {
    let url = this.getUrl(`/api/teams/${id}`);

    return this.doFetch(url, 'GET');
  }

  async getUsers(): Promise<User[]> {
    const url = this.getUrl(`/api/users`);

    return this.doFetch(url, 'GET');
  }

  async createUser(name: string) {
    let url = this.getUrl(`/api/users/`);

    return this.doFetch(url, 'POST', { name });
  }

  async updateUser(user: User) {
    let url = this.getUrl(`/api/users/${user.id}`);

    return this.doFetch(url, 'POST', {
      animal: user.animal,
      status: user.status,
    });
  }

  async updatePassword(id: string, existing: string, updated: string) {
    let url = this.getUrl(`/api/users/${id}/password`);

    return this.doFetch(url, 'POST', { existing, updated });
  }

  async updateBoard(id: string, board: any) {
    let url = this.getUrl(`/api/users/${id}/board`);

    return this.doFetch(url, 'POST', board);
  }

  async createAccount(account: AccountPreview): Promise<Account> {
    let url = this.getUrl(`/api/accounts`);

    return this.doFetch(url, 'POST', account);
  }

  async updateAccount({ id, name, attributes }: Account): Promise<Account> {
    let url = this.getUrl(`/api/accounts/${id}`);

    return this.doFetch(url, 'POST', {
      name,
      attributes,
    });
  }

  async getAccounts(): Promise<Account[]> {
    const url = this.getUrl(`/api/accounts`);

    return this.doFetch(url, 'GET');
  }

  async fetchForecastAchieved(start: DateTime, end: DateTime, userId: string) {
    let url = this.getUrl(
      `/api/forecast/achieved?${new URLSearchParams({
        start: start.toISODate(),
        end: end.toISODate(),
        userId: userId,
      })}`
    );

    return this.doFetch(url, 'GET');
  }

  async fetchForecastPredicted(start: DateTime, end: DateTime, userId: string) {
    let url = this.getUrl(
      `/api/forecast/predicted?${new URLSearchParams({
        start: start.toISODate(),
        end: end.toISODate(),
        userId: userId,
      })}`
    );

    return this.doFetch(url, 'GET');
  }

  async fetchForecastList(
    start: DateTime,
    end: DateTime,
    userId: string,
    mode: 'achieved' | 'predicted'
  ) {
    let url = this.getUrl(
      `/api/forecast/list?${new URLSearchParams({
        start: start.toISODate(),
        end: end.toISODate(),
        userId: userId,
        mode: mode.toString(),
      })}`
    );

    return this.doFetch(url, 'GET');
  }

  async fetchSchemas() {
    let url = this.getUrl(`/api/schemas/`);

    return this.doFetch(url, 'GET');
  }

  async updateSchema(schema: Schema) {
    let url = this.getUrl(`/api/schemas/`);

    return this.doFetch(url, 'POST', {
      schema: schema.schema,
      type: schema.type,
    });
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

  async loginWithToken(token: string) {
    const url = this.getUrl(`/public/login`);

    const response = await this.fetchWithTimeout(url, {
      ...this.getHeaders('POST'),
      body: JSON.stringify({ token }),
    });

    const parsed = await this.parseJson(response);

    return parsed;
  }

  async register(name: string, password: string, invite?: string) {
    const url = this.getUrl(`/public/register`);

    const payload: any = { name, password };

    if (invite) {
      payload.invite = invite;
    }

    const response = await this.fetchWithTimeout(url, {
      ...this.getHeaders('POST'),
      body: JSON.stringify(payload),
    });

    const parsed = await this.parseJson(response);

    return parsed;
  }

  async invite(invite: string) {
    const url = this.getUrl(
      `/public/register/invite?invite=${encodeURIComponent(invite)}`
    );

    const response = await this.fetchWithTimeout(url, {
      ...this.getHeaders('GET'),
    });

    const parsed = await this.parseJson(response);

    return parsed;
  }

  isValidToken = async (token: string): Promise<'ok' | 'expired'> => {
    const url = this.getUrl('/public/validate-token');

    try {
      const response = await this.fetchWithTimeout(url, {
        ...this.getHeaders('POST'),
        body: JSON.stringify({ token }),
      });

      return 'ok';
    } catch (error) {
      if (error instanceof RequestError && error.response.status === 401) {
        return 'expired';
      }

      throw error;
    }
  };
}
