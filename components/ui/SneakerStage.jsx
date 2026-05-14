export default function SneakerStage({ dark = false, label }) {
  return (
    <div className={`sneaker-stage${dark ? ' sneaker-stage--dark' : ''}`}>
      <div className="sneaker-stage__grid" aria-hidden="true" />
      <div className="sneaker-stage__shadow" aria-hidden="true" />
      <span className="sneaker-stage__label">{label || 'Sneaker · drop here'}</span>
    </div>
  );
}
