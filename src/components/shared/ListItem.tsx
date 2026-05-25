interface ListItemProps {
  title: string;
  meta?: string;
  badge?: React.ReactNode;
  onRemove: () => void;
}

export default function ListItem({
  title,
  meta,
  badge,
  onRemove,
}: ListItemProps) {
  return (
    <div className="list-item">
      <div className="list-item-info">
        <strong>{title}</strong>
        {badge}
        {meta && <div className="list-item-meta">{meta}</div>}
      </div>
      <button
        className="btn btn-danger"
        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}
