export interface PagedResponse<T> {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  data?: T[] | null;
}
