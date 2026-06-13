/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  idPrefix: string;
  title: string;
  value: string | number;
  trendText: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  bgType?: 'accent' | 'default';
  onClickInfo?: () => void;
}

export default function StatCard({
  idPrefix,
  title,
  value,
  trendText,
  trendType = 'positive',
  icon: Icon,
  onClickInfo,
}: StatCardProps) {
  return (
    <div
      id={`${idPrefix}-card`}
      onClick={onClickInfo}
      className="bg-white rounded-2xl p-5 border border-border shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.8} />
        </div>
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
            trendType === 'positive'
              ? 'bg-success/10 text-success'
              : trendType === 'negative'
              ? 'bg-danger/10 text-danger'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {trendType === 'positive' && <TrendingUp className="w-3 h-3" />}
          {trendType === 'negative' && <TrendingDown className="w-3 h-3" />}
          {trendType === 'neutral' && <Minus className="w-3 h-3" />}
          {trendText}
        </span>
      </div>

      <div>
        <div className="text-3xl font-headings font-bold text-foreground leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1.5 font-medium">{title}</div>
      </div>
    </div>
  );
}
