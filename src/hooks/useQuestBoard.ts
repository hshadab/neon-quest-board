import { useState, useEffect } from 'react';
import { Quest, QuestFilters, QuestStatus } from '@/types/quest';

const STORAGE_KEY = 'neon-quest-board';

// Sample data for initial state
const sampleQuests: Quest[] = [
  {
    id: '1',
    title: 'Design Neon UI Components',
    description: 'Create a comprehensive design system with neon glows and glassmorphism effects',
    status: 'doing',
    difficulty: 'medium',
    tags: ['design', 'ui', 'neon'],
    progress: 65,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'c1', text: 'Define color palette', completed: true, createdAt: new Date().toISOString() },
      { id: 'c2', text: 'Create button variants', completed: true, createdAt: new Date().toISOString() },
      { id: 'c3', text: 'Design card components', completed: false, createdAt: new Date().toISOString() },
    ],
    activities: [
      { id: 'a1', text: 'Started working on the design system', type: 'note', createdAt: new Date().toISOString() },
      { id: 'a2', text: 'Completed color palette definition', type: 'completion', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Implement Drag & Drop',
    description: 'Add smooth drag and drop functionality between quest columns',
    status: 'backlog',
    difficulty: 'hard',
    tags: ['feature', 'dnd', 'interaction'],
    progress: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [],
    activities: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Add Keyboard Shortcuts',
    description: 'Implement global keyboard shortcuts for common actions',
    status: 'review',
    difficulty: 'easy',
    tags: ['feature', 'accessibility', 'ux'],
    progress: 90,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'c4', text: 'Define shortcut keys', completed: true, createdAt: new Date().toISOString() },
      { id: 'c5', text: 'Implement handlers', completed: true, createdAt: new Date().toISOString() },
      { id: 'c6', text: 'Add visual indicators', completed: false, createdAt: new Date().toISOString() },
    ],
    activities: [
      { id: 'a3', text: 'Implemented basic shortcuts', type: 'completion', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Setup Local Storage',
    description: 'Persist quest data and user preferences in local storage',
    status: 'done',
    difficulty: 'medium',
    tags: ['feature', 'persistence', 'data'],
    progress: 100,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    checklist: [
      { id: 'c7', text: 'Design storage schema', completed: true, createdAt: new Date().toISOString() },
      { id: 'c8', text: 'Implement save/load', completed: true, createdAt: new Date().toISOString() },
      { id: 'c9', text: 'Add migration support', completed: true, createdAt: new Date().toISOString() },
    ],
    activities: [
      { id: 'a4', text: 'Completed storage implementation', type: 'completion', createdAt: new Date().toISOString() },
      { id: 'a5', text: 'Quest moved to done', type: 'status_change', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useQuestBoard = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<QuestFilters>({
    tags: [],
    difficulties: [],
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setQuests(parsed.quests || sampleQuests);
        setSearchTerm(parsed.searchTerm || '');
        setFilters(parsed.filters || { tags: [], difficulties: [] });
      } catch (error) {
        console.error('Failed to parse saved quest board data:', error);
        setQuests(sampleQuests);
      }
    } else {
      setQuests(sampleQuests);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      quests,
      searchTerm,
      filters,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [quests, searchTerm, filters]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addQuest = (questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>): Quest => {
    const newQuest: Quest = {
      ...questData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuests(prev => [newQuest, ...prev]);
    return newQuest;
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(quest => 
      quest.id === id 
        ? { ...quest, ...updates, updatedAt: new Date().toISOString() }
        : quest
    ));
  };

  const deleteQuest = (id: string) => {
    setQuests(prev => prev.filter(quest => quest.id !== id));
  };

  const moveQuest = (questId: string, newStatus: QuestStatus) => {
    updateQuest(questId, { status: newStatus });
  };

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    quests,
    searchTerm: debouncedSearchTerm,
    setSearchTerm,
    filters,
    setFilters,
    addQuest,
    updateQuest,
    deleteQuest,
    moveQuest,
  };
};