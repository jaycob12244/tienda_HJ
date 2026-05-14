// Configuración estática — productos viven en Supabase
// Ver: services/productService.js -> getAllProducts()

export const FILTERS = [
  { id: 'todos',       label: 'Todos' },
  { id: 'running',     label: 'Running' },
  { id: 'training',    label: 'Training' },
  { id: 'trail',       label: 'Trail' },
  { id: 'lifestyle',   label: 'Lifestyle' },
  { id: 'competition', label: 'Competition' },
  { id: 'streetwear',  label: 'Streetwear' },
];

export const NAV_LINKS = [
  { id: 'technology', label: 'Tecnología' },
  { id: 'shop',       label: 'Tienda' },
  { id: 'performance',label: 'Performance' },
];

export const CATEGORIES = [
  { id: 'running',    label: 'Running',    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop' },
  { id: 'training',   label: 'Training',   image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80&auto=format&fit=crop' },
  { id: 'trail',      label: 'Trail',      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=700&q=80&auto=format&fit=crop' },
  { id: 'lifestyle',  label: 'Lifestyle',  image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&q=80&auto=format&fit=crop' },
  { id: 'streetwear', label: 'Streetwear', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80&auto=format&fit=crop' },
];

export const BENEFITS = [
  { icon: 'shield',     k: '01', t: 'Garantía 2 años',      d: 'Defectos de fabricación cubiertos.' },
  { icon: 'truck',      k: '02', t: 'Envío en 24–48 h',     d: 'A toda España peninsular.' },
  { icon: 'check',   k: '03', t: 'Devoluciones 30 días', d: 'Sin preguntas, sin coste.' },
  { icon: 'support', k: '04', t: 'Soporte humano',        d: 'Lunes a viernes, 9–18 h.' },
];

export const TECH_POINTS = [
  { num: '01', t: 'Aero-Weave Upper',  d: 'Tejido de filamentos cruzados de 0.3 mm.' },
  { num: '02', t: 'Kinetic Core',      d: 'Núcleo de amortiguación reactiva.' },
  { num: '03', t: 'Adaptive Traction', d: 'Suela que se adapta al terreno.' },
];
