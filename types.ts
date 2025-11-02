
export interface TrendItem {
  term: string;
  region_name: string;
  country_name: string;
  rank: string;
  score: string | null;
  week: string;
  refresh_date: string;
}

export interface ChartData {
  week: string;
  [key: string]: number | string;
}
