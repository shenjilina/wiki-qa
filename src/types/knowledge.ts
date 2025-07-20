import { KnowledgeItem, NewKnowledgeItem} from './index';

// 知识库特定的扩展类型
export interface KnowledgeState {
  items: KnowledgeItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

export interface KnowledgeActions {
  addItem: (item: NewKnowledgeItem) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<KnowledgeItem>) => void;
  exportItems: () => void;
  importItems: (items: KnowledgeItem[]) => void;
}

// 知识库默认分类
export const DEFAULT_CATEGORIES = [
  '技术开发',
  '人工智能', 
  '商业管理',
  '科学知识',
  '生活常识',
  '其他',
] as const;

export type DefaultCategory = typeof DEFAULT_CATEGORIES[number];