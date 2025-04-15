//searchByTypeListResult.ts

export interface SearchByTypeListResult {
  totalResults: string;
  results: {
    image: string;
    name: string;
    link: string;
  }[];
}
