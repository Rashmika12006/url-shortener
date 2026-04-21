export interface URLData {
  id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: string;
}

export interface ShortenResponse {
  shortUrl: string;
  shortCode: string;
}
