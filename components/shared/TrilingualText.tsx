import { cn } from "@/lib/utils";
import { AudioButton } from "@/components/audio/AudioButton";

interface TrilingualTextProps {
  lithuanian: string;
  english: string;
  bengali: string;
  variant?: "stacked" | "inline";
  showAudio?: boolean;
  audioSize?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TrilingualText({
  lithuanian,
  english,
  bengali,
  variant = "stacked",
  showAudio = true,
  audioSize = "sm",
  size = "md",
  className,
}: TrilingualTextProps) {
  const ltSize = { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-2xl" }[size];
  const enSize = { sm: "text-xs", md: "text-sm", lg: "text-base", xl: "text-lg" }[size];
  const bnSize = { sm: "text-xs", md: "text-sm", lg: "text-base", xl: "text-xl" }[size];

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
        <span className={cn("lt-text font-bold", ltSize)}>{lithuanian}</span>
        {showAudio && <AudioButton text={lithuanian} size={audioSize} />}
        <span className={cn("en-text", enSize)}>{english}</span>
        <span className={cn("bn-text font-bengali", bnSize)}>{bengali}</span>
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-center gap-2">
        <span className={cn("lt-text font-bold", ltSize)}>{lithuanian}</span>
        {showAudio && <AudioButton text={lithuanian} size={audioSize} />}
      </div>
      <span className={cn("en-text", enSize)}>{english}</span>
      <span className={cn("bn-text font-bengali", bnSize)}>{bengali}</span>
    </div>
  );
}
