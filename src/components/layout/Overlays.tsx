/** Fixed decorative layers: 64px grid + fine film grain (matches reference). */
export function Overlays() {
  return (
    <>
      <div className="grid-overlay" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
