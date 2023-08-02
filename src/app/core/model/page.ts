export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
}
