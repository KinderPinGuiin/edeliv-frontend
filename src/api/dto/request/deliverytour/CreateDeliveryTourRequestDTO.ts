/**
 * Request sent to create a delivery tour.
 */
export default class CreateDeliveryTourRequestDTO {

  /**
   * @param name        The delivery tour's name (ID of the tour).
   * @param startDate   The delivery tour's start date.
   * @param endDate     The delivery tour's end date.
   * @param delivererId The deliverer associated to this tour.
   */
  constructor(
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly delivererId: number,
  ) {}

}