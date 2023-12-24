/**
 * Build an URL with the given URI and search params.
 * 
 * @param   uri          The URI used to build the final URL.
 * @param   searchParams The search parameters to add to the URL.
 * @returns              The resulting URL.
 */
export function buildURL(uri: string, searchParams: Record<string, string>): string {
  let finalURL = uri;
  const searchParamsBuilder = new URLSearchParams();
  for (const searchParam in searchParams) {
    searchParamsBuilder.append(searchParam, searchParams[searchParam]);
  }
  finalURL += "?" + searchParamsBuilder.toString();

  return finalURL;
}

/**
 * Build the URL search params based on the given pair. If a value is null, then it's not added to the params.
 * 
 * @param params The params to use to build the URLSearchParams. 
 */
export function buildSearchParamsNullSafe(params: Record<string, unknown | null>): URLSearchParams {
  const searchParamsBuilder = new URLSearchParams();
  for (const searchParam in params) {
    if (params[searchParam] == null) {
      continue;
    }
    searchParamsBuilder.append(searchParam, `${params[searchParam]}`);
  }

  return searchParamsBuilder;
}