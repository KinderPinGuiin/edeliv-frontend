/**
 * Request sent to create a deliverer.
 */
export default class CreateDelivererRequestDTO {

  /**
   * @param name        The deliverer's name.
   * @param isAvailable Indicates if the deliverer is available or not.
   */
  constructor(
    public readonly name: string,
    public readonly available: boolean,
  ) {}

}