import { cn } from "@/lib/utils";

interface BengaliExplanationProps {
  content: string;
  title?: string;
  englishContent?: string;
  variant?: "default" | "tip" | "warning";
  className?: string;
}

export function BengaliExplanation({
  content,
  title = "💡 বাংলায় ব্যাখ্যা",
  englishContent,
  variant = "default",
  className,
}: BengaliExplanationProps) {
  const variantStyles = {
    default: "border-emerald-500/20 bg-emerald-950/20",
    tip: "border-amber-500/20 bg-amber-950/20",
    warning: "border-red-500/20 bg-red-950/20",
  };

  const titleStyles = {
    default: "text-emerald-400",
    tip: "text-amber-400",
    warning: "text-red-400",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        variantStyles[variant],
        className
      )}
    >
      <p className={cn("text-xs font-semibold uppercase tracking-wider mb-2", titleStyles[variant])}>
        {title}
      </p>
      <p className="font-bengali text-emerald-200 text-sm leading-relaxed">{content}</p>
      {englishContent && (
        <p className="text-gray-400 text-xs mt-2 leading-relaxed">{englishContent}</p>
      )}
    </div>
  );
}
