import Client, { Params } from "./Client";

const baseParams: Params = {
  baseUrl: "https://api.thecatapi.com/v1",
  endpoint: "images/search",
  headers: {
    "x-api-key": "c8390923-a9c3-4038-a53f-8efcaa1b48c7"
  }
};

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
  size?: "full" | "med" | "small" | "thumb";
  mime_types?: string;
  order?: "RANDOM" | "ASC" | "DESC";
  limit: number;
  page: number;
  category_ids?: number;
  format?: "json" | "src";
  breed_id?: "string";
}

interface Cat {
  id: string;
  url: string;
  categories?: {
    id: number;
    name: string;
  }[];
  breeds?: {
    id: string;
    name: string;
  }[];
}

export interface CatPage {
  pageCount: number;
  currentPage: number;
  totalCatCount: number;
  cats: Cat[];
}

function getCatPage(queryParams: QueryParams): Promise<CatPage> {
  const client = new Client({
    ...baseParams,
    queryParams
  });

  return client.get()
    .then(({ response, headers }) => {
      const total = parseInt(headers.get("pagination-count") ?? "0");

      return {
        pageCount: calculatePageCount(total, queryParams.limit),
        currentPage: queryParams.page,
        totalCatCount: total,
        cats: response
      };
    });
}

function calculatePageCount(total: number, perPage: number) {
  return Math.ceil(total / perPage);
}

export const CatApi = {
  getCatPage
};
