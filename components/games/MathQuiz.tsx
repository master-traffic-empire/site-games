'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Problem = { question: string; answer: number };

function generateProblem(): Problem {
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 100);
      b = Math.floor(Math.random() * 100);
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 100);
      b = Math.floor(Math.random() * a + 1);
      answer = a - b;
      break;
    case '*':
      a = Math.floor(Math.random() * 13);
      b = Math.floor(Math.random() * 13);
      answer = a * b;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  return { question: `${a} ${op} ${b}`, answer };
}

const DURATION = 30;

export default function MathQuiz() {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  const submit = useCallback(() => {
    if (!input.trim()) return;
    if (!started) setStarted(true);
    const num = parseInt(input, 10);
    if (num === problem.answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback('Correct!');
    } else {
      setStreak(0);
      setFeedback(`Wrong! ${problem.question} = ${problem.answer}`);
    }
    setProblem(generateProblem());
    setInput('');
    setTimeout(() => setFeedback(''), 1500);
  }, [input, problem, started]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit();
  };

  const reset = () => {
    setProblem(generateProblem());
    setInput('');
    setScore(0);
    setStreak(0);
    setTimeLeft(DURATION);
    setStarted(false);
    setFinished(false);
    setFeedback('');
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>
          Score: {score} {streak > 2 ? `(${streak} streak)` : ''}
        </span>
        <span style={{ fontWeight: 700, fontSize: 18 }}>
          {finished ? 'Done' : `${timeLeft}s`}
        </span>
      </div>

      {!finished ? (
        <>
          <div style={{
            fontSize: 48, fontWeight: 800, margin: '32px 0',
            color: 'var(--accent)',
          }}>
            {problem.question} = ?
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={(e) => { setInput(e.target.value); if (!started) setStarted(true); }}
              onKeyDown={handleKeyDown}
              disabled={finished}
              autoFocus
              style={{
                width: 120, padding: '10px 16px',
                background: 'var(--bg)', border: '2px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', fontSize: 22,
                textAlign: 'center', outline: 'none',
              }}
            />
            <button
              onClick={submit}
              style={{
                padding: '10px 20px', background: 'var(--accent)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 16, fontWeight: 700,
              }}
            >
              Go
            </button>
          </div>
          {feedback && (
            <div style={{
              padding: 8, borderRadius: 6, fontSize: 14, fontWeight: 600,
              color: feedback === 'Correct!' ? '#4caf50' : '#e64646',
            }}>
              {feedback}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: 32 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#4caf50', marginBottom: 8 }}>
            {score}
          </div>
          <div style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            problems solved in {DURATION} seconds
          </div>
          <button onClick={reset} style={{
            padding: '10px 24px', background: 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 16, fontWeight: 700,
          }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
