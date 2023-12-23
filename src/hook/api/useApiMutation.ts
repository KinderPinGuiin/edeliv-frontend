import { UseMutationResult, useMutation, useQueryClient } from "react-query";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import { useEffect } from "react";
import APIOptions from "@type/APIOptions";
import { buildURL } from "@utils/url-utils";

/**
 * Send a mutation request (POST, PUT or DELETE) to the given endpoint.
 * 
 * @param  endpoint    The endpoint to send the request.
 * @param  requestData The data to send, can be null if the request is sent later (sendRequest = false).
 * @param  sendRequest Indicates if the request should be sent immediately.
 * @param  options     Some custom options about the request.
 * @return             A map containing multiple metrics about the sent request (isLoading, data...)
 */
export default function useApiMutation<T, U>(
  endpoint: APIEndpoint<T, U>, 
  requestData: T | null, 
  sendRequest: boolean = true,
  options: APIOptions | undefined = undefined
) {
  // Check that the given endpoint method is GET
  if (endpoint.method == "GET") {
    throw `Invalid endpoint method for useApiMutation (${endpoint.method}), to perform GET calls, use the useApi hook.`;
  }

  // Setup the mutation
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data) => {
      const response = await fetch(import.meta.env.VITE_API_HOST + buildURL(endpoint.uri, data.searchParams ?? {}), {
        method: endpoint.method,
        body: JSON.stringify(requestData ?? data.data),
        headers: {
          "Content-Type": options?.headers?.["Content-Type"] ?? "application/json",
          ...options?.headers,
        },
        credentials: options?.credentialsPolicy ?? "omit",
      })

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
      onSuccess: (data) => {
        if (options?.queryKey != undefined) {
          queryClient.setQueryData(options?.queryKey, data)
        }
        if (options?.invalidateQueries != undefined) {
          queryClient.invalidateQueries(options.invalidateQueries)
        }
        if (options?.onSuccess) {
          options?.onSuccess();
        }
      },
      onError: options?.onError,
      retry: options?.retry ?? 0
    },
  ) as UseMutationResult<U, any, any, any>;

  // Send the request
  useEffect(() => {
    if (sendRequest) {
      mutation.mutate(null)
    }
  }, [mutation.mutate]);

  // Returns the mutation result
  return { ...mutation }
}
