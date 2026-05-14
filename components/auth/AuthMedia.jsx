import SneakerStage from '../ui/SneakerStage';

export default function AuthMedia({ tag, title, sub }) {
  return (
    <aside className="am">
      <div className="am__chrome">
        <div className="pill" style={{ borderColor: 'rgba(250,249,246,0.18)', background: 'rgba(10,10,10,0.5)', color: 'var(--paper)' }}>
          <span className="pill__dot"></span>
          <span>{tag}</span>
        </div>
        <div className="am__counter">{String.fromCharCode(78,176)} 0042 / 4000</div>
      </div>

      <div className="am__stage">
        <SneakerStage dark label="AUTH · drop sneaker photo" />
      </div>

      <div className="am__caption">
        <h2 className="am__title">{title}</h2>
        <p className="am__sub">{sub}</p>
        <div className="am__row">
          <div>
            <div className="eyebrow" style={{ color: 'rgba(250,249,246,0.55)' }}>Edición</div>
            <div className="am__rowVal">SS26 · Drop 04</div>
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(250,249,246,0.55)' }}>Stock</div>
            <div className="am__rowVal" style={{ fontFamily: 'var(--font-mono)' }}>412 / 4000</div>
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(250,249,246,0.55)' }}>Tiempo</div>
            <div className="am__rowVal" style={{ fontFamily: 'var(--font-mono)' }}>02 : 41 : 18</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
