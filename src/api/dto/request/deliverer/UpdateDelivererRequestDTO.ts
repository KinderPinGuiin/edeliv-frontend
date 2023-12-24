/**
 * Request sent to update a deliverer.
 */
export default class UpdateDelivererRequestDTO {

  /**
   * @param id             The ID of the deliverer to update.
   * @param newName        The new name of the deliverer.
   * @param newIsAvailable Indicates if the deliverer is available or not.
   * @param creationDate   The deliverer's creation date.
   */
  constructor(
    public readonly id: number,
    public readonly newName: string,
    public readonly newIsAvailable: boolean,
  ) {}

}