export default interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: [T];
}
