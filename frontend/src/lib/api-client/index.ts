import { env } from '../../config';
import { HttpApiClient } from './http.client';
import { ApiClient } from './types';

const client: ApiClient = new HttpApiClient();

export { client };
