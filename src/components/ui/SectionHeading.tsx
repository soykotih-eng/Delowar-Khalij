import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  light = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "start";
  light?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag className={cn("heading", light && "text-white")}>{title}</Tag>
      {text && <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/70" : "text-muted")}>{text}</p>}
    </div>
  );
}
