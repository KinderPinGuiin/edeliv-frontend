import CreateDelivererRequestDTO from "@api/dto/request/deliverer/CreateDelivererRequestDTO";
import UpdateDelivererRequestDTO from "@api/dto/request/deliverer/UpdateDelivererRequestDTO";
import CreateDeliveryRequestDTO from "@api/dto/request/delivery/CreateDeliveryRequestDTO";
import UpdateDeliveryRequestDTO from "@api/dto/request/delivery/UpdateDeliveryRequestDTO";
import CreateDeliveryTourRequestDTO from "@api/dto/request/deliverytour/CreateDeliveryTourRequestDTO";
import UpdateDeliveryTourRequestDTO from "@api/dto/request/deliverytour/UpdateDeliveryTourRequestDTO";
import DelivererResponseDTO from "@api/dto/response/deliverer/DelivererResponseDTO";
import DeliveryTourResponseDTO from "@api/dto/response/delivery-tour/DeliveryTourResponseDTO";
import DeliveryResponseDTO from "@api/dto/response/delivery/DeliveryResponseDTO";
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


  public static readonly GET_ALL_DELIVERIES = new APIEndpoint("/delivery/get-all", "GET", null, SearchResultResponseDTO<DeliveryResponseDTO>);
  public static readonly CREATE_DELIVERY = new APIEndpoint("/delivery/create", "POST", CreateDeliveryRequestDTO, DeliveryResponseDTO);
  public static readonly UPDATE_DELIVERY = new APIEndpoint("/delivery/update", "POST", UpdateDeliveryRequestDTO, DeliveryResponseDTO);
  public static readonly DELETE_DELIVERY = new APIEndpoint("/delivery/delete", "DELETE", null, DeliveryResponseDTO);

  public static readonly GET_ALL_TOURS = new APIEndpoint("/delivery-tour/get-all", "GET", null, SearchResultResponseDTO<DeliveryTourResponseDTO>);
  public static readonly CREATE_DELIVERY_TOUR = new APIEndpoint("/delivery-tour/create", "POST", CreateDeliveryTourRequestDTO, DeliveryTourResponseDTO);
  public static readonly UPDATE_DELIVERY_TOUR = new APIEndpoint("/delivery-tour/update", "POST", UpdateDeliveryTourRequestDTO, DeliveryTourResponseDTO);
  public static readonly DELETE_DELIVERY_TOUR = new APIEndpoint("/delivery-tour/delete", "DELETE", null, DeliveryTourResponseDTO);

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
