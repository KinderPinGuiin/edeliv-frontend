/**
 * Request sent to update a delivery tour.
 */
export default class UpdateDeliveryTourRequestDTO {

  /**
   * @param name         The delivery tour's name (ID of the tour).
   * @param newStartDate The delivery tour's start date.
   * @param newEndDate   The delivery tour's end date.
   * @param delivererId  The deliverer associated to this tour.
   * @param deliveries   The deliveries (IDs) associated to this tour.
   */
  constructor(
    public readonly name: string,
    public readonly newStartDate: Date,
    public readonly newEndDate: Date,
    public readonly delivererId: number,
    public readonly deliveries: number[],
  ) {}

}