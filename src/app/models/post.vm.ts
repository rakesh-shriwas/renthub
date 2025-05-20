export interface IPostRequest {
  userId: number;
  apartmentType: string;
  name: string;
  sharedProperty: boolean;
  location: string;
  squareFit: number;
  rent: number;
  apartmentFurnished: boolean;
  amenities: string[];
  title: string;
  description: string;
  rentNegotiable: boolean;
  priceMode: string;
  stayType: string;
  images: string[];
  isFavorite?: boolean;
  featured: boolean;
}

export interface IPostResponse extends IPostRequest {
  id: number;
}
