import DeliveryTourResponseDTO from "../delivery-tour/DeliveryTourResponseDTO";

/**
 * Represents a deliverer.
 */
export default class DelivererResponseDTO {

  /**
   * @param id            The deliverer's ID.
   * @param name          The deliverer's name.
   * @param isAvailable   Indicates if the deliverer is available or not.
   * @param creationDate  The deliverer's creation date.
   * @param deliveryTours The delivery tours associated to this deliverer.
   */
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly isAvailable: boolean,
    public readonly creationDate: Date,
    public readonly deliveryTours: DeliveryTourResponseDTO[]
  ) {}

}