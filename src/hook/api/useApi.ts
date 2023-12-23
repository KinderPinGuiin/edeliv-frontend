import { UseQueryResult, useQuery } from "react-query";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import APIOptions from "@type/APIOptions";

/**
 * Send a GET request to the given endpoint.
 * 
 * @param  endpoint    The endpoint to retrieve.
 * @param  queryParams A map associating the different query parameters to their values.
 * @param  options     Some custom options about the request.
 * @return             A map containing multiple metrics about the request (isLoading, data, ...)
 */
export default function useApi<T, U>(
  endpoint: APIEndpoint<T, U>, 
  queryParams: Record<string, any> = {},
  options: APIOptions | undefined = undefined,
) {
  // Check that the given endpoint method is GET
  if (endpoint.method != "GET") {
    throw `Invalid endpoint method for useApi (${endpoint.method}), use GET or call the useApiMutation hook.`;
  }

  // Extract query params and replace them with their associated values
  const queryParamPattern = /{[a-z0-9]+}/i;
  let finalURI = import.meta.env.VITE_API_HOST + endpoint.uri;
  if (options?.searchParams != null) {
    finalURI += "?" + options?.searchParams?.toString();
  }
  endpoint.uri.match(queryParamPattern)?.forEach(queryParamIdentifier => {
    finalURI = finalURI.replace(
      queryParamIdentifier, 
      queryParams[queryParamIdentifier.substring(1, queryParamIdentifier.indexOf("}"))]
    );
  });

  // Send the request and returns the useQuery hook result
  return useQuery(
    options?.queryKey ?? endpoint.uri, 
    async () => {
      const response = await fetch(finalURI, {
        headers: options?.headers, 
        credentials: options?.credentialsPolicy ?? "omit" 
      });

      // Check error and throw the response body if there is one
      if (!response.ok) {
        throw await response.json();
      }

      if (endpoint.responseType === null) {
        return null;
      }

      return response.json();
    },
    {
      staleTime: options?.staleTime,
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      retry: options?.retry ?? 0,
    }
  ) as UseQueryResult<U, any>;
}
