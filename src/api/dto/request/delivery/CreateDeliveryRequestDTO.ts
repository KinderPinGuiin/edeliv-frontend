/**
 * Request sent to create a delivery.
 */
export default class CreateDeliveryRequestDTO {

  /**
   * @param startAddress The start location of the delivery.
   * @param endAddress   The location where the delivery arrives.
   */
  constructor(
    public readonly startAddress: string,
    public readonly endAddress: string,
  ) {}

}