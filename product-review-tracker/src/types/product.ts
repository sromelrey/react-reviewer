export type ReviewStatus = "new" | "reviewed";
export type ProductFilter = "all" | ReviewStatus;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: ProductFilter;
};

export type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export type ProductsResponse = {
  products: ApiProduct[];
};
