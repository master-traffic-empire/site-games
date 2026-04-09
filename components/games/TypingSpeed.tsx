'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS = [
  'the','be','to','of','and','a','in','that','have','it','for','not','on','with','he',
  'as','you','do','at','this','but','his','by','from','they','we','say','her','she','or',
  'an','will','my','one','all','would','there','their','what','so','up','out','if','about',
  'who','get','which','go','me','when','make','can','like','time','no','just','him','know',
  'take','people','into','year','your','good','some','could','them','see','other','than',
  'then','now','look','only','come','its','over','think','also','back','after','use','two',
  'how','our','work','first','well','way','even','new','want','because','any','these',
  'give','day','most','us','great','between','need','large','under','water','long','very',
  'right','every','small','place','world','each','still','hand','high','keep','last',
];

const DURATION = 30;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TypingSpeed() {
  const [wordList, setWordList] = useState<string[]>(() => shuffle(WORDS).slice(0, 40));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!started) setStarted(true);
    if (val.endsWith(' ')) {
      const typed = val.trim();
      if (typed === wordList[currentIdx]) setCorrect((c) => c + 1);
      else setIncorrect((c) => c + 1);
      setCurrentIdx((i) => i + 1);
      setInput('');
      if (currentIdx + 1 >= wordList.length) {
        setWordList((prev) => [...prev, ...shuffle(WORDS).slice(0, 20)]);
      }
    } else {
      setInput(val);
    }
  }, [started, wordList, currentIdx]);

  const wpm = finished ? Math.round((correct / DURATION) * 60) : 0;
  const accuracy = finished && (correct + incorrect) > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

  const reset = () => {
    setWordList(shuffle(WORDS).slice(0, 40));
    setCurrentIdx(0);
    setInput('');
    setTimeLeft(DURATION);
    setStarted(false);
    setFinished(false);
    setCorrect(0);
    setIncorrect(0);
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>
          {finished ? `${wpm} WPM` : `${timeLeft}s`}
        </span>
        <button onClick={reset} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
          Restart
        </button>
      </div>
      <div style={{
        background: 'var(--bg)', padding: 20, borderRadius: 10, marginBottom: 16,
        fontSize: 20, lineHeight: 2, minHeight: 120, overflow: 'hidden',
      }}>
        {wordList.slice(currentIdx, currentIdx + 20).map((word, i) => (
          <span
            key={currentIdx + i}
            style={{
              marginRight: 10,
              color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: i === 0 ? 700 : 400,
              borderBottom: i === 0 ? '2px solid var(--accent)' : 'none',
            }}
          >
            {word}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        disabled={finished}
        placeholder={finished ? 'Press Restart to try again' : 'Start typing...'}
        autoFocus
        style={{
          width: '100%', padding: '12px 16px',
          background: 'var(--bg)', border: '2px solid var(--border)',
          borderRadius: 8, color: 'var(--text)', fontSize: 18,
          outline: 'none',
        }}
      />
      {finished && (
        <div style={{
          marginTop: 16, padding: 16, background: '#4caf5022', borderRadius: 10, textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#4caf50' }}>{wpm} WPM</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {correct} correct, {incorrect} incorrect -- {accuracy}% accuracy
          </div>
        </div>
      )}
    </div>
  );
}
