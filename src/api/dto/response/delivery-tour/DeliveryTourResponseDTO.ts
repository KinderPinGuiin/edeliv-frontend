import DelivererResponseDTO from '../deliverer/DelivererResponseDTO';
import DeliveryResponseDTO from '../delivery/DeliveryResponseDTO';

/**
 * Represents a delivery tour (set of delivery with a start and end date).
 */
export default class DeliveryTourResponseDTO {

  /**
   * @param name       The delivery tour's name (ID of the tour).
   * @param startDate  The delivery tour's start date.
   * @param endDate    The delivery tour's end date.
   * @param deliverer  The deliverer associated to this tour.
   * @param deliveries The deliveries associated to this tour.
   */
  constructor(
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly deliverer: DelivererResponseDTO,
    public readonly deliveries: DeliveryResponseDTO[],
  ) {}

}