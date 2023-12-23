/**
 * A generic DTO that contains the result of research.
 */
export default class SearchResultResponseDTO<T> {

  /**
   * @param page        The current page of the research..
   * @param pageSize    The size of the page..
   * @param maxElements The maximum amount of elements.
   * @param elements    The result of the search.
   */
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly maxElements: number,
    public readonly elements: Array<T>,
  ) {}

}