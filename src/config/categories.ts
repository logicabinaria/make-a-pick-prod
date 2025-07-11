export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  suggestions: string[];
  placeholder: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'What to Eat',
    emoji: '🍕',
    description: 'Decide what to have for your meal',
    suggestions: ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Salad', 'Tacos'],
    placeholder: 'Enter food option...'
  },
  {
    id: 'places',
    name: 'Where to Go',
    emoji: '📍',
    description: 'Pick a destination or place to visit',
    suggestions: ['Park', 'Mall', 'Beach', 'Museum', 'Cafe', 'Library'],
    placeholder: 'Enter place...'
  },
  {
    id: 'clothing',
    name: 'What to Wear',
    emoji: '👕',
    description: 'Choose your outfit for the day',
    suggestions: ['Casual', 'Formal', 'Sporty', 'Trendy', 'Comfortable'],
    placeholder: 'Enter clothing option...'
  },
  {
    id: 'entertainment',
    name: 'What to Watch',
    emoji: '🎬',
    description: 'Pick something to watch',
    suggestions: ['Movie', 'TV Series', 'Documentary', 'YouTube', 'Netflix'],
    placeholder: 'Enter show/movie...'
  },
  {
    id: 'games',
    name: 'What to Play',
    emoji: '🎮',
    description: 'Choose a game to play',
    suggestions: ['Video Game', 'Board Game', 'Card Game', 'Sport', 'Puzzle'],
    placeholder: 'Enter game...'
  },
  {
    id: 'work',
    name: 'Work Tasks',
    emoji: '💼',
    description: 'Prioritize your work tasks',
    suggestions: ['Email', 'Meeting', 'Project', 'Research', 'Planning'],
    placeholder: 'Enter task...'
  },
  {
    id: 'creative',
    name: 'Creative Ideas',
    emoji: '🎨',
    description: 'Spark your creativity',
    suggestions: ['Drawing', 'Writing', 'Music', 'Photography', 'Crafts'],
    placeholder: 'Enter creative idea...'
  },
  {
    id: 'custom',
    name: 'Custom Decision',
    emoji: '➕',
    description: 'Create your own decision',
    suggestions: [],
    placeholder: 'Enter your option...'
  }
];

export const getCategories = (): Category[] => {
  return CATEGORIES;
};

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryByIndex = (index: number): Category | undefined => {
  return CATEGORIES[index];
};