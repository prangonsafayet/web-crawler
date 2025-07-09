export interface ResultData {
  html_version: string;
  title: string;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  num_internal_links: number;
  num_external_links: number;
  num_inaccessible_links: number;
  has_login_form: boolean;
}

export interface LinkData {
  id: string;
  url: string;
  status_code: number;
}

export interface URLRecord {
  id: string;
  url: string;
  status: 'queued' | 'running' | 'done' | 'error';
  results: ResultData | null;
  links: LinkData[];
  created_at: string;
  updated_at: string;
}
