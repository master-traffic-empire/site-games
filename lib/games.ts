export type Category = 'Puzzle' | 'Arcade' | 'Card' | 'Word' | 'Brain';

export interface GameInfo {
  slug: string;
  name: string;
  category: Category;
  description: string;
  metaDescription: string;
  color: string;
  controls: string;
}

export const games: GameInfo[] = [
  {
    slug: '2048',
    name: '2048',
    category: 'Puzzle',
    description: 'Slide numbered tiles on a grid to combine them and reach 2048.',
    metaDescription: 'Play 2048 online for free. Slide tiles, combine numbers, and reach the 2048 tile. No download required.',
    color: '#edc22e',
    controls: 'Arrow keys or swipe to slide tiles',
  },
  {
    slug: 'snake',
    name: 'Snake',
    category: 'Arcade',
    description: 'Guide the snake to eat food and grow without hitting walls or yourself.',
    metaDescription: 'Play Snake online for free. Classic snake game — eat, grow, survive. No download required.',
    color: '#4caf50',
    controls: 'Arrow keys or swipe to change direction',
  },
  {
    slug: 'tetris',
    name: 'Tetris',
    category: 'Puzzle',
    description: 'Rotate and drop falling blocks to clear complete rows.',
    metaDescription: 'Play Tetris online for free. Stack falling blocks, clear rows, beat your high score. No download required.',
    color: '#00bcd4',
    controls: 'Arrow keys to move/rotate, Down to drop',
  },
  {
    slug: 'minesweeper',
    name: 'Minesweeper',
    category: 'Puzzle',
    description: 'Reveal tiles and use numbers to find all hidden mines without detonating any.',
    metaDescription: 'Play Minesweeper online for free. Uncover tiles, flag mines, clear the board. No download required.',
    color: '#607d8b',
    controls: 'Click to reveal, right-click to flag',
  },
  {
    slug: 'flappy-bird',
    name: 'Flappy Bird',
    category: 'Arcade',
    description: 'Tap to flap and navigate through pipes without crashing.',
    metaDescription: 'Play Flappy Bird online for free. Tap to fly, dodge pipes, beat your record. No download required.',
    color: '#ff9800',
    controls: 'Click or Space to flap',
  },
  {
    slug: 'breakout',
    name: 'Breakout',
    category: 'Arcade',
    description: 'Bounce a ball off your paddle to destroy all the bricks.',
    metaDescription: 'Play Breakout online for free. Control the paddle, bounce the ball, smash all bricks. No download required.',
    color: '#e91e63',
    controls: 'Mouse or Arrow keys to move paddle',
  },
  {
    slug: 'memory-match',
    name: 'Memory Match',
    category: 'Brain',
    description: 'Flip cards and find matching pairs using your memory.',
    metaDescription: 'Play Memory Match online for free. Flip cards, find pairs, train your memory. No download required.',
    color: '#9c27b0',
    controls: 'Click cards to flip them',
  },
  {
    slug: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    category: 'Brain',
    description: 'Place X or O to get three in a row before the AI does.',
    metaDescription: 'Play Tic Tac Toe online for free. Challenge the AI with minimax strategy. No download required.',
    color: '#3f51b5',
    controls: 'Click a cell to place your mark',
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    category: 'Puzzle',
    description: 'Fill the 9x9 grid so every row, column, and 3x3 box contains 1-9.',
    metaDescription: 'Play Sudoku online for free. Solve puzzles with hints and validation. No download required.',
    color: '#795548',
    controls: 'Click a cell, then click a number',
  },
  {
    slug: 'wordle',
    name: 'Wordle',
    category: 'Word',
    description: 'Guess the 5-letter word in 6 tries with color-coded feedback.',
    metaDescription: 'Play Wordle online for free. Guess the 5-letter word in 6 attempts. No download required.',
    color: '#689f38',
    controls: 'Type letters, Enter to submit, Backspace to delete',
  },
  {
    slug: 'solitaire',
    name: 'Solitaire',
    category: 'Card',
    description: 'Classic Klondike solitaire — sort all cards into foundation piles by suit.',
    metaDescription: 'Play Solitaire online for free. Classic Klondike card game. No download required.',
    color: '#2e7d32',
    controls: 'Click to select, click destination to move',
  },
  {
    slug: 'pong',
    name: 'Pong',
    category: 'Arcade',
    description: 'Classic paddle game — bounce the ball past your opponent to score.',
    metaDescription: 'Play Pong online for free. Classic arcade paddle game vs AI. No download required.',
    color: '#ff5722',
    controls: 'W/S or Arrow keys to move paddle',
  },
  {
    slug: 'space-invaders',
    name: 'Space Invaders',
    category: 'Arcade',
    description: 'Shoot down waves of descending aliens before they reach you.',
    metaDescription: 'Play Space Invaders online for free. Blast aliens, dodge bullets, save Earth. No download required.',
    color: '#1a237e',
    controls: 'Arrow keys to move, Space to shoot',
  },
  {
    slug: 'typing-speed',
    name: 'Typing Speed',
    category: 'Brain',
    description: 'Type words as fast and accurately as you can before time runs out.',
    metaDescription: 'Test your typing speed online for free. Measure WPM and accuracy. No download required.',
    color: '#00897b',
    controls: 'Type the displayed words',
  },
  {
    slug: 'math-quiz',
    name: 'Math Quiz',
    category: 'Brain',
    description: 'Solve quick arithmetic problems against the clock.',
    metaDescription: 'Play Math Quiz online for free. Quick arithmetic challenges to sharpen your mind. No download required.',
    color: '#f44336',
    controls: 'Type your answer, Enter to submit',
  },
];

export function getGameBySlug(slug: string): GameInfo | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGamesByCategory(category: Category): GameInfo[] {
  return games.filter((g) => g.category === category);
}

export const categories: Category[] = ['Puzzle', 'Arcade', 'Card', 'Word', 'Brain'];
