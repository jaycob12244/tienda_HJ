import Icon from '../ui/Icon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container container--wide footer__top">
        <div className="footer__brand">
          <div className="footer__word">AURIX</div>
          <p className="footer__tag">
            <span className="editorial">Cinematic </span>
            footwear engineered for the silent city.
          </p>
          <div className="footer__social">
            <a className="footer__icon" aria-label="Instagram"><Icon name="instagram" size={16} /></a>
            <a className="footer__icon" aria-label="Twitter"><Icon name="twitter" size={16} /></a>
            <a className="footer__icon" aria-label="YouTube"><Icon name="youtube" size={16} /></a>
          </div>
        </div>

        <div className="footer__grid">
          <div>
            <div className="eyebrow">Tienda</div>
            <ul><li>Running</li><li>Training</li><li>Trail</li><li>Lifestyle</li><li>Competition</li></ul>
          </div>
          <div>
            <div className="eyebrow">AURIX</div>
            <ul><li>Manifiesto</li><li>Tecnología</li><li>Atletas</li><li>Sostenibilidad</li><li>Prensa</li></ul>
          </div>
          <div>
            <div className="eyebrow">Soporte</div>
            <ul><li>Envíos</li><li>Devoluciones</li><li>Tallas</li><li>Cuidado</li><li>Contacto</li></ul>
          </div>
          <div>
            <div className="eyebrow">Legal</div>
            <ul><li>Términos</li><li>Privacidad</li><li>Cookies</li><li>Aviso legal</li></ul>
          </div>
        </div>
      </div>

      <div className="container container--wide footer__bottom">
        <span className="mono footer__copy">© 2026 AURIX TECHNICAL FOOTWEAR · MADRID / TOKYO</span>
        <span className="footer__lang">
          <Icon name="globe" size={14} />
          <span className="mono">ES · EUR</span>
        </span>
      </div>

      <div className="footer__massive" aria-hidden="true">AURIX</div>
    </footer>
  );
}
