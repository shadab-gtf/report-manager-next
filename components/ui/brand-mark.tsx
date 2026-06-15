import Image from "next/image";

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/brand-logo.svg"
        alt="Report Manager brand logo"
        width={compact ? 44 : 72}
        height={compact ? 24 : 40}
        priority
        className="h-auto w-auto"
      />
      {!compact ? (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">Report Manager</p>
          <p className="text-xs font-medium text-muted-foreground">
            Productivity OS
          </p>
        </div>
      ) : null}
    </div>
  );
}
