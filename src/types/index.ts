export interface Book {
  id: string;
  title: string;
  author: string;
  published_year: number;
  summary: string;
  main_content: string;
  insights: string;
  quotes: string[];
  created_at?: string;
}

export interface ContentCard {
  id: string;
  book_id: string;
  card_type: 'core_content' | 'background' | 'summary';
  content: string;
  created_at: string;
}

export interface UserFavorite {
  user_id: string;
  book_id: string;
  created_at: string;
} 