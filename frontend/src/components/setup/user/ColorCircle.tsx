export interface ColorCircleProps {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ColorCircle = ({ color, setColor }: ColorCircleProps) => {
  return (
    <div
      onClick={() => setColor(color)}
      className={`color-circle ${
        color === color ? 'color-circle-selected' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      <div></div>
    </div>
  );
};
