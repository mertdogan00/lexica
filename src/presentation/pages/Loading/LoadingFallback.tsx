// LoadingFallback is used as the Suspense placeholder while lazy pages load.
export function LoadingFallback(): React.ReactNode {
  return (
    <section className="page page-loading">
      <div className="page-loading-card">
        <div className="page-loading-title">Loading...</div>
        <div className="page-loading-sub">Preparing your workspace.</div>
      </div>
    </section>
  );
}
