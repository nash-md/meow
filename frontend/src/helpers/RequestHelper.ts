import { DateTime } from 'luxon';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { ResponseParseError } from '../errors/ResponseParseError';
import { TokenUndefinedError } from '../errors/TokenUndefinedError';
import { Account, AccountPreview } from '../interfaces/Account';
import { Card, CardPreview } from '../interfaces/Card';
import { EventType } from '../interfaces/EventType';
import { Lane, LaneRequest } from '../interfaces/Lane';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode, Integration, Team } from '../interfaces/Team';
import { User } from '../interfaces/User';
import { FilterMode } from '../pages/HomePage';
import { RequestHelperUrlError } from '../errors/RequestHelperUrlError';
import { FILTER_BY_NONE } from '../Constants';

type HttpMethod = 'POST' | 'GET' | 'DELETE';

export const strip = (value: string) => {
  let segment = value.endsWith('/') ? value.substring(0, value.length - 1) : value;
  return segment.startsWith('/') ? segment.substring(1, segment.length) : segment;
};

const createUrlOrThrow = (url: string): URL => {
  try {
    return new URL(url);
  } catch (error) {
    throw new RequestHelperUrlError(error as Error);
  }
};

export const getRequestClient = (token?: string) => {
  return new RequestHelper(getBaseUrl(), token);
};

export const getBaseUrl = (): URL => {
  if (import.meta.env.VITE_URL) {
    const url = import.meta.env.VITE_URL.toString() as string;

    return createUrlOrThrow(url);
  }

  if (typeof window !== 'undefined') {
    const url = `${window.location.protocol}//${window.location.host}`;

    return createUrlOrThrow(url);
  }

  throw new RequestHelperUrlError(new Error('VITE_URL not set and window object undefined'));
};

export class RequestHelper {
  token: string | undefined;
  base: URL;
  timeout: number;
  private controllers: AbortController[] = [];
  destroyed = false;

  constructor(base: URL, token?: string, timeout: number = 8000) {
    this.base = base;
    this.token = token;
    this.timeout = timeout;
  }

  getUrl(path?: string): URL {
    const segments = this.base
      ? [...this.base.pathname.split('/').filter((segment) => segment !== '')]
      : [];

    const url = new URL(this.base!);

    if (path) {
      segments.push(strip(path));
    }

    url.pathname = segments.join('/');

    return url;
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
    url: URL,
    request: RequestInit,
    timeout = this.timeout
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      this.controllers.push(controller);

      const id = setTimeout(() => {
        controller.abort('timeout');
      }, timeout);

      const response = await fetch(url, {
        ...request,
        signal: controller.signal,
      });

      clearTimeout(id);

      this.removeController(controller);

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
      // TODO check if json
      const body = await response.json();

      return body as any; // TODO return body as unknown
    } catch (error) {
      throw new ResponseParseError(response, 'Invalid JSON document');
    }
  };

  private removeController(controller: AbortController) {
    const index = this.controllers.indexOf(controller);
    if (index !== -1) {
      this.controllers.splice(index, 1);
    }
  }

  destroy() {
    this.destroyed = true;

    for (const controller of this.controllers) {
      controller.abort('cancel');
    }
    this.controllers = [];
  }

  async getCards(): Promise<Card[]> {
    const url = this.getUrl(`/api/cards`);

    return this.doFetch(url, 'GET');
  }

  async getCard(id: Card['_id']): Promise<Card> {
    const url = this.getUrl(`/api/cards/${id}`);

    return this.doFetch(url, 'GET');
  }

  async updateCard(card: Card) {
    let url = this.getUrl(`/api/cards/${card._id}`);

    return this.doFetch(url, 'POST', {
      laneId: card.laneId,
      name: card.name,
      amount: card.amount,
      closedAt: card.closedAt,
      nextFollowUpAt: card.nextFollowUpAt,
      userId: card.userId,
      attributes: card.attributes,
      status: card.status,
    });
  }

  async doFetch(url: URL, method: HttpMethod, body?: any) {
    try {
      const request = {
        ...this.getHeaderWithAuthentication(method),
        ...(body ? { body: JSON.stringify(body) } : {}),
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

  async getAccountEvents(id: string) {
    const url = this.getUrl(`/api/accounts/${id}/events`);

    return this.doFetch(url, 'GET');
  }

  async createAccountEvent(id: string, text: string) {
    const url = this.getUrl(`/api/accounts/${id}/events`);

    return this.doFetch(url, 'POST', {
      type: EventType.CommentCreated,
      text: text,
    });
  }

  async getCardEvents(id: string) {
    const url = this.getUrl(`/api/cards/${id}/events`);

    return this.doFetch(url, 'GET');
  }

  async createCardEvent(id: string, text: string) {
    const url = this.getUrl(`/api/cards/${id}/events`);

    return this.doFetch(url, 'POST', {
      type: EventType.CommentCreated,
      text: text,
    });
  }

  async getLanes() {
    const url = this.getUrl(`/api/lanes`);

    return this.doFetch(url, 'GET');
  }

  async getLanesStatistic(filter?: {
    text: string | undefined;
    mode: Set<FilterMode>;
    userId: string;
  }) {
    let url = this.getUrl(`/api/lanes/statistic`);

    const params = new URLSearchParams({});

    if (filter?.mode && filter.mode.size !== 0) {
      const list = Array.from(filter.mode).map((mode) => mode.toString());

      params.append('filter', list.join(','));
    }

    if (filter?.text) {
      params.append('text', filter?.text);
    }

    if (filter?.userId && filter.userId !== FILTER_BY_NONE.key) {
      params.set('userId', filter?.userId);
    }

    url.search = params.toString();

    return this.doFetch(url, 'GET');
  }

  async updateLane(lane: Lane) {
    let url = this.getUrl(`/api/lanes/${lane._id}`);

    return this.doFetch(url, 'POST', {
      name: lane.name,
      inForecast: lane.inForecast,
      index: lane.index,
      color: lane.color,
      tags: lane.tags,
    });
  }

  async updateLanes(lanes: LaneRequest[]) {
    let url = this.getUrl(`/api/lanes`);
    return this.doFetch(url, 'POST', lanes);
  }

  async updateTeam(id: Team['_id'], currency: CurrencyCode) {
    let url = this.getUrl(`/api/teams/${id}`);

    return this.doFetch(url, 'POST', { currency: currency });
  }

  async updateIntegration(id: Team['_id'], integration: Integration) {
    let url = this.getUrl(`/api/teams/${id}/integrations`);

    return this.doFetch(url, 'POST', integration);
  }

  async getTeam(id: Team['_id']): Promise<Team> {
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
    let url = this.getUrl(`/api/users/${user._id}`);

    return this.doFetch(url, 'POST', {
      animal: user.animal,
      status: user.status,
      color: user.color,
    });
  }

  async updatePassword(id: string, existing: string, updated: string) {
    let url = this.getUrl(`/api/users/${id}/password`);

    return this.doFetch(url, 'POST', { existing, updated });
  }

  async updateBoard(id: string, board: any) {
    // TODO add type
    let url = this.getUrl(`/api/users/${id}/board`);

    return this.doFetch(url, 'POST', board);
  }

  async createAccount(account: AccountPreview): Promise<Account> {
    let url = this.getUrl(`/api/accounts`);

    return this.doFetch(url, 'POST', account);
  }

  async updateAccount({ _id, name, attributes }: Account): Promise<Account> {
    let url = this.getUrl(`/api/accounts/${_id}`);

    return this.doFetch(url, 'POST', {
      name,
      attributes,
    });
  }

  async getAccounts(): Promise<Account[]> {
    const url = this.getUrl(`/api/accounts`);

    return this.doFetch(url, 'GET');
  }

  async getAccount(id: Account['_id']): Promise<Account> {
    const url = this.getUrl(`/api/accounts/${id}`);

    return this.doFetch(url, 'GET');
  }

  async getAccountReferences(id: Account['_id'], name: string): Promise<Account> {
    const url = this.getUrl(`/api/accounts/${id}/references/${name}`);

    return this.doFetch(url, 'GET');
  }

  async fetchForecastAchieved(start: DateTime, end: DateTime, userId?: string) {
    let url = this.getUrl(`/api/forecast/achieved`);

    const params = new URLSearchParams({
      start: start.toISODate() ?? '',
      end: end.toISODate() ?? '',
    });

    if (userId) {
      params.set('userId', userId);
    }

    url.search = params.toString();

    return this.doFetch(url, 'GET');
  }

  async fetchForecastPredicted(start: DateTime, end: DateTime, userId?: string) {
    let url = this.getUrl(`/api/forecast/predicted`);

    const params = new URLSearchParams({
      start: start.toISODate() ?? '',
      end: end.toISODate() ?? '',
    });

    if (userId) {
      params.set('userId', userId);
    }

    url.search = params.toString();

    return this.doFetch(url, 'GET');
  }

  async fetchForecastList(
    start: DateTime,
    end: DateTime,
    mode: 'achieved' | 'predicted',
    userId?: string
  ) {
    let url = this.getUrl(`/api/forecast/list`);

    const params = new URLSearchParams({
      start: start.toISODate() ?? '',
      end: end.toISODate() ?? '',
      mode: mode.toString(),
    });

    if (userId) {
      params.set('userId', userId);
    }

    url.search = params.toString();

    return this.doFetch(url, 'GET');
  }

  async fetchLaneTimeSeries(start: DateTime, end: DateTime, userId?: string) {
    let url = this.getUrl(`/api/forecast/time-series`);

    const params: any = new URLSearchParams({
      start: start.toISODate() ?? '',
      end: end.toISODate() ?? '',
    });

    if (userId) {
      params.set('userId', userId);
    }

    url.search = params.toString();

    return this.doFetch(url, 'GET');
  }

  async fetchSchemas() {
    let url = this.getUrl(`/api/schemas/`);

    return this.doFetch(url, 'GET');
  }

  async updateSchema(schema: Schema) {
    let url = this.getUrl(`/api/schemas/`);

    return this.doFetch(url, 'POST', {
      schema: schema.attributes,
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
    const url = this.getUrl(`/public/register/invite`);

    url.search = new URLSearchParams({
      invite: invite,
    }).toString();

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
