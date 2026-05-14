export default function SneakerStage({ dark = false, label, image }) {
  return (
    <div className={`sneaker-stage${dark ? ' sneaker-stage--dark' : ''}`}>
      <div className="sneaker-stage__grid" aria-hidden="true" />
      <div className="sneaker-stage__shadow" aria-hidden="true" />
      {image
        ? <img src={image} alt={label || 'Sneaker'} className="sneaker-stage__img" />
        : <span className="sneaker-stage__label">{label || 'Sneaker · drop here'}</span>
      }
    </div>
  );
}
