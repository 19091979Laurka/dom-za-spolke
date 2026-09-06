export function ChoiceCard({
  selected,
  title,
  hint,
  onClick,
  disabled,
}: {
  selected: boolean;
  title: string;
  hint?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      data-selected={selected}
      className="brand-choice"
    >
      <strong>{title}</strong>
      {hint ? <span>{hint}</span> : null}
    </button>
  );
}
