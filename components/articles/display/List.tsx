export function List({ children }: { children: React.ReactNode[] }) {
  return (
    <ul>
      {children.map((child, index) => (
        <li key={new Date().getTime() + index}>{child}</li>
      ))}
    </ul>
  );
}
