import { Badge } from "@/components/ui/badge";

interface TranslationGroupProps {
  title: string;
  items: string[];
}

export function TranslationGroup({ title, items }: TranslationGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <Badge>{title}</Badge>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-border/70 bg-background/45 px-3 py-2 text-sm leading-6"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
