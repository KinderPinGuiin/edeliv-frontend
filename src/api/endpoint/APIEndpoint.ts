import CreateDelivererRequestDTO from "@api/dto/request/deliverer/CreateDelivererRequestDTO";
import UpdateDelivererRequestDTO from "@api/dto/request/deliverer/UpdateDelivererRequestDTO";
import DelivererResponseDTO from "@api/dto/response/deliverer/DelivererResponseDTO";
import SearchResultResponseDTO from "@api/dto/response/search/SearchResultResponseDTO";
import { Class } from "@type/Class";

/**
 * Class containing the API endpoints metadata (URI, request type...). This class also contains all the existing API 
 * endpoints.
 * 
 * @param T The request type.
 * @param S The response type.
 */
export default class APIEndpoint<T, U> {

  public static readonly GET_ALL_DELIVERERS = new APIEndpoint("/deliverer/get-all", "GET", null, SearchResultResponseDTO<DelivererResponseDTO>);
  public static readonly CREATE_DELIVERER = new APIEndpoint("/deliverer/create", "POST", CreateDelivererRequestDTO, DelivererResponseDTO);
  public static readonly UPDATE_DELIVERER = new APIEndpoint("/deliverer/update", "POST", UpdateDelivererRequestDTO, DelivererResponseDTO);
  public static readonly DELETE_DELIVERER = new APIEndpoint("/deliverer/delete", "DELETE", null, DelivererResponseDTO);

  /**
   * @param uri          The endpoint's URI.
   * @param method       The request's method.
   * @param requestType  The request type.
   * @param responseType The response type.
   */
  constructor(
    public readonly uri: string,
    public readonly method: "GET" | "POST" | "PUT" | "DELETE",
    public readonly requestType: Class<T> | null,
    public readonly responseType: Class<U> | null,
  ) {}

  public toApiUrl(): string {
    return import.meta.env.VITE_API_HOST + this.uri;
  }

}
