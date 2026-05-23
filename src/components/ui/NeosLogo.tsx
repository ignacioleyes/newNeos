import { NeosMark } from "./NeosMark";

interface NeosLogoProps {
  className?: string;
  withMark?: boolean;
}

export function NeosLogo({ className = "", withMark = false }: NeosLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      {withMark && (
        <NeosMark className="h-6 w-6 text-primary" />
      )}
      <span className="font-display font-medium tracking-tight text-2xl leading-none">
        neos
        <sup className="text-[0.5em] align-super ml-0.5 opacity-70">®</sup>
      </span>
    </span>
  );
}
