export interface Image {
  id: string;
  cover: string;
  thumbnail: string;
}

export interface Query {
  limit?: number;
  page?: number;
}
