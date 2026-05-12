interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}
