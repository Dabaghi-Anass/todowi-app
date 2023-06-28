export interface Task {
  id: string;
  tid: string;
  content: string;
  background: string;
  size: number;
  category: string;
  creationDate: number;
  isPinned: boolean;
  isHidden: boolean;
  [key: string]: any;
}
export interface Settings {
  grid: boolean;
  categoryOpen: boolean;
  filterOpen: boolean;
}