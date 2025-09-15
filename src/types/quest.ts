export type QuestStatus = 'backlog' | 'doing' | 'review' | 'done';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'epic';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  text: string;
  createdAt: string;
  type: 'note' | 'status_change' | 'completion';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  difficulty: Difficulty;
  tags: string[];
  progress: number; // 0-100
  dueDate?: string;
  checklist: ChecklistItem[];
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestFilters {
  tags: string[];
  difficulties: Difficulty[];
}

export interface QuestBoardState {
  quests: Quest[];
  searchTerm: string;
  filters: QuestFilters;
}