export function AboutPage() {
  return (
    <div className="page-shell">
      <section className="hero card">
        <div>
          <p className="eyebrow">About</p>
          <h1>Institutional research, built like a product.</h1>
          <p className="lead">
            Atlas Equity Research is an operating system for research teams: company coverage, memos, industry work,
            macro outlooks, journal notes, and content operations in one stack.
          </p>
        </div>
        <div className="hero-panel">
          <div className="panel-row"><span>Focus</span><strong>Public equity research workflows</strong></div>
          <div className="panel-row"><span>Scope</span><strong>Coverage, valuation, macro, and research notes</strong></div>
          <div className="panel-row"><span>Mode</span><strong>Database-backed, editor-friendly, extensible</strong></div>
        </div>
      </section>
    </div>
  );
}
