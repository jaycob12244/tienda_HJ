export function scorePwd(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

export function PwdMeter({ score }) {
  const labels = ['Débil', 'Mejorable', 'Buena', 'Fuerte', 'Excelente'];
  return (
    <span className="pm">
      <span className="pm__bars">
        {[0, 1, 2, 3].map(i => <span key={i} className={i < score ? 'is-on' : ''} />)}
      </span>
      <span className="pm__label">{labels[score]}</span>
    </span>
  );
}
