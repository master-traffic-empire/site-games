'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

const WORDS = [
  'APPLE','BRAVE','CRANE','DREAM','EAGLE','FLAME','GRACE','HOUSE','IVORY','JOKER',
  'KNIFE','LEMON','MUSIC','NIGHT','OCEAN','PIANO','QUEEN','ROBOT','SNAKE','TRAIN',
  'ULTRA','VIVID','WORLD','YOUTH','ZEBRA','BEACH','CLOUD','DANCE','EIGHT','FROST',
  'GHOST','HEART','IMAGE','JUICE','KARMA','LIGHT','MAGIC','NOBLE','ORBIT','PEARL',
  'QUIET','RIVER','STONE','TIGER','UNITY','VOICE','WHEAT','XENON','YIELD','ZONES',
];

type Guess = { word: string; result: ('correct' | 'present' | 'absent')[] };

function evaluate(guess: string, target: string): Guess['result'] {
  const result: Guess['result'] = Array(5).fill('absent');
  const targetArr = target.split('');
  const used = Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetArr[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === targetArr[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }
  return result;
}

const colorMap = { correct: '#4caf50', present: '#edc22e', absent: '#3a3a4a' };

export default function Wordle() {
  const target = useMemo(() => WORDS[Math.floor(Math.random() * WORDS.length)], []);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const letterStatus = useMemo(() => {
    const map: Record<string, 'correct' | 'present' | 'absent'> = {};
    for (const g of guesses) {
      for (let i = 0; i < 5; i++) {
        const letter = g.word[i];
        const status = g.result[i];
        if (status === 'correct') map[letter] = 'correct';
        else if (status === 'present' && map[letter] !== 'correct') map[letter] = 'present';
        else if (!map[letter]) map[letter] = 'absent';
      }
    }
    return map;
  }, [guesses]);

  const submit = useCallback(() => {
    if (current.length !== 5 || gameOver) return;
    const result = evaluate(current, target);
    const newGuesses = [...guesses, { word: current, result }];
    setGuesses(newGuesses);
    setCurrent('');

    if (current === target) {
      setMessage('You got it!');
      setGameOver(true);
    } else if (newGuesses.length >= 6) {
      setMessage(`The word was ${target}`);
      setGameOver(true);
    }
  }, [current, guesses, target, gameOver]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'Enter') { submit(); return; }
      if (e.key === 'Backspace') { setCurrent((c) => c.slice(0, -1)); return; }
      if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) {
        setCurrent((c) => c + e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, gameOver, submit]);

  const handleKey = (key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') { submit(); return; }
    if (key === 'DEL') { setCurrent((c) => c.slice(0, -1)); return; }
    if (current.length < 5) setCurrent((c) => c + key);
  };

  const rows = Array.from({ length: 6 }, (_, i) => {
    if (i < guesses.length) return guesses[i];
    if (i === guesses.length) return { word: current.padEnd(5, ' '), result: null };
    return { word: '     ', result: null };
  });

  const keyboard = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','DEL'],
  ];

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {row.word.split('').map((letter, ci) => (
              <div
                key={ci}
                style={{
                  width: 48, height: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8,
                  border: `2px solid ${row.result ? colorMap[row.result[ci]] : 'var(--border)'}`,
                  background: row.result ? colorMap[row.result[ci]] : 'transparent',
                  color: '#fff',
                  fontSize: 20, fontWeight: 700,
                }}
              >
                {letter.trim()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {keyboard.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                style={{
                  padding: '10px 8px',
                  minWidth: key.length > 1 ? 56 : 32,
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12, fontWeight: 700,
                  background: letterStatus[key] ? colorMap[letterStatus[key]] : 'var(--bg)',
                  color: '#fff',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      {message && (
        <div style={{
          marginTop: 16, padding: 12, borderRadius: 8, fontWeight: 600,
          background: guesses[guesses.length - 1]?.word === target ? '#4caf5022' : '#e6464622',
          color: guesses[guesses.length - 1]?.word === target ? '#4caf50' : '#e64646',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
