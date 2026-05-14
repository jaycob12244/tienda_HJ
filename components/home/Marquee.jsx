import Icon from '../ui/Icon';

const items = ['Silent motion', 'Built for the city', 'Aero-weave shell', 'Kinetic core', 'Adaptive traction', 'Drop 04 · SS26'];

export default function Marquee() {
  const content = items.flatMap((it, i) => [
    <span key={`i-${i}`} className="mq-chip">{it}</span>,
    <span key={`s-${i}`} className="star"><Icon name="diamond" size={9} /></span>,
  ]);

  return (
    <div className="marquee marquee--dark">
      <div className="marquee__track">
        <span>{content}</span>
        <span aria-hidden="true">{content}</span>
      </div>
    </div>
  );
}
