//requisitesType.ts

export interface RequisitesResultType {
  totalResults: number;
  results: {
    name: string;
    url: string;
    image: {
      name: string;
      image: string;
    }[];
  }[];
}
