import { useState } from 'react';
import Icon from '../ui/Icon';

export default function FloatField({ label, type = 'text', value, onChange, error, hint, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPwd = type === 'password';
  const inputType = isPwd && show ? 'text' : type;
  const filled = value && value.length > 0;

  return (
    <div className={`af${filled ? ' is-filled' : ''}${error ? ' is-error' : ''}${focused ? ' is-focused' : ''}`}>
      <label className="af__label">{label}</label>
      <div className="af__wrap">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
        />
        {isPwd && (
          <button type="button" className="af__eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Ocultar' : 'Mostrar'}>
            <Icon name={show ? 'eye-off' : 'eye'} size={16} />
          </button>
        )}
      </div>
      <div className={`af__hint${error ? ' is-error' : ''}`}>
        {error
          ? <><Icon name="close" size={11} /> {error}</>
          : hint
            ? hint
            : <>&nbsp;</>
        }
      </div>
    </div>
  );
}
