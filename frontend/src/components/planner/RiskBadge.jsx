import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export function RiskBadge({ level }) {
  if (level === 'Safe') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
        <ShieldCheck className="w-3 h-3" /> Safe
      </span>
    );
  }

  if (level === 'Warning') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <AlertTriangle className="w-3 h-3" /> Warning
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 animate-pulse">
      <AlertOctagon className="w-3 h-3" /> Critical
    </span>
  );
}