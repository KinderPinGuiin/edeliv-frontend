/**
 * Request sent to update a delivery.
 */
export default class UpdateDeliveryRequestDTO {

  /**
   * @param id              The ID of the delivery to update.
   * @param newStartAddress The new start location of the delivery.
   * @param newEndAddress   The new start location of the delivery.
   * @param deliveryTourId  The delivery tour associated to this delivery.
   */
  constructor(
    public readonly id: number,
    public readonly newStartAddress: string,
    public readonly newEndAddress: string,
    public readonly deliveryTourId: string | null,
  ) {}

}