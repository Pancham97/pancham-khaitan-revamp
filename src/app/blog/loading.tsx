export default function BlogLoading() {
    return (
        <div className="loading-state" aria-busy="true" aria-live="polite">
            <div className="spinner" aria-hidden />
            <p className="muted">Loading posts…</p>
        </div>
    );
}
