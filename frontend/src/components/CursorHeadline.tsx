import { useEffect, useState } from 'react';

export interface CursorHeadlineProps {
  text: string[];
}

function getRandomMilliseconds(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const CursorHeadline = ({ text }: CursorHeadlineProps) => {
  const [line, setLine] = useState(text[0]);

  const [current, setCurrent] = useState('');
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (direction === 'right') {
        setCurrent(line.slice(0, current.length + 1));
      }

      if (direction === 'left' && current.length > 0) {
        setCurrent(line.slice(0, current.length - 1));
      }

      if (line.length === current.length) {
        setIsStart(false);
        setIsEnd(true);
      }

      if (direction === 'left' && current.length === 0) {
        setIsStart(true);
        setIsEnd(false);
      }
    }, getRandomMilliseconds(80, 160));
    return () => clearTimeout(timeout);
  }, [current, direction]);

  useEffect(() => {
    if (!isEnd) {
      return;
    }

    const timeout = setTimeout(() => {
      setDirection('left');
    }, getRandomMilliseconds(3000, 5000));

    return () => clearTimeout(timeout);
  }, [isEnd]);

  useEffect(() => {
    if (!isStart) {
      return;
    }

    const i = index < text.length - 1 ? index + 1 : 0;

    setIndex(i);
    setLine(text[i]);

    const timeout = setTimeout(() => {
      setDirection('right');
    }, getRandomMilliseconds(100, 2000));

    return () => clearTimeout(timeout);
  }, [isStart]);

  return (
    <div className="hello-title">
      <div>
        <h2 className="text">{current}</h2>
      </div>
      <div className="cursor-blink"></div>
    </div>
  );
};
