import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading meteorological telemetry">
      {/* Top Advisory Card Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 animate-shimmer" />
            <div className="space-y-1.5">
              <div className="w-48 h-4 rounded bg-slate-200 animate-shimmer" />
              <div className="w-32 h-2.5 rounded bg-slate-100" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-7 rounded-lg bg-slate-200 animate-shimmer" />
            <div className="w-20 h-7 rounded-lg bg-slate-200 animate-shimmer" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full h-4 rounded bg-slate-100" />
          <div className="w-5/6 h-4 rounded bg-slate-100" />
          <div className="w-3/4 h-4 rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="h-16 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
            <div className="w-20 h-2.5 rounded bg-slate-200" />
            <div className="w-32 h-3.5 rounded bg-slate-200" />
          </div>
          <div className="h-16 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
            <div className="w-20 h-2.5 rounded bg-slate-200" />
            <div className="w-28 h-3.5 rounded bg-slate-200" />
          </div>
          <div className="h-16 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
            <div className="w-20 h-2.5 rounded bg-slate-200" />
            <div className="w-36 h-3.5 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Hero Overview Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="w-28 h-3 rounded bg-slate-200" />
            <div className="w-40 h-12 rounded bg-slate-200 animate-shimmer" />
            <div className="w-32 h-3 rounded bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-50 p-2.5 space-y-1.5 border border-slate-100">
                <div className="w-14 h-2 rounded bg-slate-200" />
                <div className="w-20 h-4 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
            <div className="w-28 h-3 rounded bg-slate-200" />
            <div className="w-full h-14 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Grid Cards Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 min-h-[220px]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-shimmer" />
                <div className="space-y-1">
                  <div className="w-28 h-3.5 rounded bg-slate-200 animate-shimmer" />
                  <div className="w-16 h-2.5 rounded bg-slate-100" />
                </div>
              </div>
              <div className="w-12 h-5 rounded bg-slate-100" />
            </div>

            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-slate-100" />
              <div className="w-4/5 h-3 rounded bg-slate-100" />
            </div>

            <div className="h-20 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
              <div className="w-24 h-2.5 rounded bg-slate-200" />
              <div className="w-36 h-4 rounded bg-slate-200 animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
