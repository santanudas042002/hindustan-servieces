interface searchByCategoryListResponseType {
  totalResults: number;
  results: {
    name: string;
    image: string;
    link: string;
  }[];
}

export default searchByCategoryListResponseType;
