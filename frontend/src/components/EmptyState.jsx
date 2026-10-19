export default function EmptyState({ title = "Nothing here yet", subtitle = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-2 text-center px-4">
      <p className="font-display text-2xl text-ivory/70">{title}</p>
      {subtitle && <p className="text-ivory/40 text-sm max-w-md">{subtitle}</p>}
    </div>
  );
}
