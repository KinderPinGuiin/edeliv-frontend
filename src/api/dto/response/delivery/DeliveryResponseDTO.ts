import DeliveryTourResponseDTO from "@dto/response/delivery-tour/DeliveryTourResponseDTO";

/**
 * Represents a delivery.
 */
export default class DeliveryResponseDTO {

  /**
   * @param id           The delivery's ID.
   * @param startAddress The delivery's start address.
   * @param endAddress   The location where the delivery arrives.
   * @param tour         The tour associated to the delivery.
   */
  constructor(
    public readonly id: number,
    public readonly startAddress: string,
    public readonly endAddress: string,
    public readonly tour: DeliveryTourResponseDTO | null,
  ) {}

}