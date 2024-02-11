export interface Article {
  id: number;
  title: string;
  description: string;
  content: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentPoint: number;
}
