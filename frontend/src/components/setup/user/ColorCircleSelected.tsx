export interface ColorCircleSelectedProps {
  color: string;
  setColor: any;
}

export const ColorCircleSelected = ({
  color,
  setColor,
}: ColorCircleSelectedProps) => {
  return (
    <div
      onClick={() => setColor(color)}
      className="color-circle color-circle-selected"
      style={{ border: `3px solid ${color}` }}
    >
      <div style={{ backgroundColor: color }}></div>
    </div>
  );
};
