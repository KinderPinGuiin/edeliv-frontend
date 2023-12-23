/**
 * Custom options that can be used inside of the API hooks (useApi, useApiMutation).
 */
type APIOptions = {
  /**
   * The query key associated to the sent request (used for caching, invalidating...).
   */
  queryKey?: string | any[],

  /**
   * Custom headers to send with the request.
   */
  headers?: Record<string, any>,

  /**
   * The queries to invalidate after a mutation (only used by useApiMutation).
   */
  invalidateQueries?: string[],

  /**
   * The time (in ms) to set the retrieved data in a stale state (only works with useApi).
   */
  staleTime?: number,

  /**
   * Indicates if the credentials should be included in the request and retrieved from the response (default: included).
   */
  credentialsPolicy?: RequestCredentials,

  /**
   * The URL search params to append to the URL if needed.
   */
  searchParams?: URLSearchParams,

  /**
   * Callback called when the request is on error.
   */
  onError?: () => void,

  /**
   * Callback called when the request is on success.
   */
  onSuccess?: () => void,

  /**
   * The amount of time a request must be retried before returning the real error.
   */
  retry?: number,
}

export default APIOptions;
