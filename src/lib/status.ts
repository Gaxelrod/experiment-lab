export const STATUS_ORDER = ['draft', 'ready', 'running', 'complete', 'killed'] as const;
export type Status = (typeof STATUS_ORDER)[number];

export const STATUS_CONFIG: Record<Status, {
  label: string;
  dotColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}> = {
  draft: {
    label: 'Draft',
    dotColor: 'bg-[#333333]',
    borderColor: 'border-l-[#333333]',
    textColor: 'text-text-dim',
    badgeBg: 'bg-[rgba(85,85,85,0.15)] border border-[rgba(85,85,85,0.3)]',
  },
  ready: {
    label: 'Ready',
    dotColor: 'bg-epcvip-yellow',
    borderColor: 'border-l-epcvip-yellow',
    textColor: 'text-epcvip-yellow',
    badgeBg: 'bg-[rgba(242,199,68,0.15)] border border-[rgba(242,199,68,0.3)]',
  },
  running: {
    label: 'Running',
    dotColor: 'bg-epcvip-amber',
    borderColor: 'border-l-epcvip-amber',
    textColor: 'text-epcvip-amber',
    badgeBg: 'bg-[rgba(192,137,46,0.15)] border border-[rgba(192,137,46,0.3)]',
  },
  complete: {
    label: 'Complete',
    dotColor: 'bg-epcvip-green',
    borderColor: 'border-l-epcvip-green',
    textColor: 'text-epcvip-green',
    badgeBg: 'bg-[rgba(42,107,63,0.15)] border border-[rgba(42,107,63,0.3)]',
  },
  killed: {
    label: 'Killed',
    dotColor: 'bg-epcvip-red',
    borderColor: 'border-l-epcvip-red',
    textColor: 'text-epcvip-red',
    badgeBg: 'bg-[rgba(192,64,64,0.15)] border border-[rgba(192,64,64,0.3)]',
  },
};

export const PRIORITY_CONFIG: Record<string, { textColor: string; badgeBg: string }> = {
  high: {
    textColor: 'text-epcvip-red',
    badgeBg: 'bg-[rgba(192,64,64,0.15)] border border-[rgba(192,64,64,0.3)]',
  },
  medium: {
    textColor: 'text-epcvip-yellow',
    badgeBg: 'bg-[rgba(242,199,68,0.15)] border border-[rgba(242,199,68,0.3)]',
  },
  low: {
    textColor: 'text-text-muted',
    badgeBg: 'bg-[rgba(85,85,85,0.15)] border border-[rgba(85,85,85,0.3)]',
  },
};

export function truncateHypothesis(text: string, max = 80): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
}
