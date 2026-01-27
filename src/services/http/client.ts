import axios, { AxiosInstance, AxiosResponse } from 'axios';

const createApiClient = (baseURL: string, headers: Record<string, string> = {}): AxiosInstance =>
    axios.create({
        baseURL,
        timeout: 10000,
        headers: { Accept: 'application/json', ...headers },
    });

const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

const handleError = <T>(fallback: T) => (): T => fallback;

export const createGetRequest = <T>(
    client: AxiosInstance,
    fallback: T
) => async (
    endpoint: string = '',
    params: Record<string, unknown> = {}
): Promise<T> =>
        client
            .get<T>(endpoint, { params })
            .then(handleResponse)
            .catch(handleError(fallback));

export { createApiClient };
