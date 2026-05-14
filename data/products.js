export const EXTERNAL_PRODUCTS = [
  { id: "ext-01", brand: "Nike",   name: "Air Max 90",       category: "lifestyle",   price: 130, currency: "€", badge: "STOCK",   rating: 4.7, desc: "Silueta icónica con Air visible.",              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-02", brand: "Nike",   name: "React Infinity",   category: "running",     price: 160, currency: "€", badge: "NEW",     rating: 4.6, desc: "Máximo retorno de energía en cada zancada.",    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-03", brand: "Adidas", name: "Ultraboost 24",    category: "running",     price: 180, currency: "€", badge: "DROP",    rating: 4.8, desc: "Sistema Boost de máxima amortiguación.",        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-04", brand: "Adidas", name: "Samba OG",         category: "streetwear",  price: 110, currency: "€", badge: "STOCK",   rating: 4.7, desc: "El clásico que nunca pasa de moda.",            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-05", brand: "Nike",   name: "Air Force 1 '07",  category: "lifestyle",   price: 115, currency: "€", badge: "STOCK",   rating: 4.9, desc: "El blanco que lo combina todo.",                image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-06", brand: "Nike",   name: "Pegasus Trail 5",  category: "trail",       price: 140, currency: "€", badge: "NEW",     rating: 4.5, desc: "Tracción todo terreno, comodidad de asfalto.",  image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-07", brand: "Adidas", name: "Gazelle Indoor",   category: "training",    price: 100, currency: "€", badge: "LIMITED", rating: 4.6, desc: "Perfil retro para cualquier entorno.",          image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&q=80&auto=format&fit=crop" },
  { id: "ext-08", brand: "Nike",   name: "Vaporfly 3",       category: "competition", price: 270, currency: "€", badge: "PRO",     rating: 5.0, desc: "El zapato de los récords mundiales.",           image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=700&q=80&auto=format&fit=crop" },
];

export const PRODUCTS = [
  { id: "ax-01", name: "Aurix One Phantom",  category: "running",     price: 289, currency: "€", colorway: "Stealth",      badge: "STOCK",   rating: 4.8, desc: "Edición de telemetría sigilosa." },
  { id: "ax-02", name: "Aurix One Silver",   category: "training",    price: 269, currency: "€", colorway: "Reflective",   badge: "LIMITED", rating: 4.7, desc: "Acabado de chasis reflectante." },
  { id: "ax-03", name: "Aurix One Volt",     category: "running",     price: 299, currency: "€", colorway: "Neon Volt",    badge: "DROP",    rating: 4.9, desc: "Perfil cinético neón." },
  { id: "ax-04", name: "Aurix Drift Mono",   category: "streetwear",  price: 249, currency: "€", colorway: "Bone",         badge: "STOCK",   rating: 4.6, desc: "Silueta urbana monocromo." },
  { id: "ax-05", name: "Aurix Trail K2",     category: "trail",       price: 329, currency: "€", colorway: "Onyx",         badge: "STOCK",   rating: 4.7, desc: "Suela de tracción profunda K2." },
  { id: "ax-06", name: "Aurix Court Ivory",  category: "lifestyle",   price: 219, currency: "€", colorway: "Ivory",        badge: "STOCK",   rating: 4.5, desc: "Court silhouette en piel marfil." },
  { id: "ax-07", name: "Aurix Loop Carbon",  category: "competition", price: 379, currency: "€", colorway: "Carbon Black", badge: "PRO",     rating: 4.9, desc: "Placa de carbono — carrera." },
  { id: "ax-08", name: "Aurix Echo Sand",    category: "lifestyle",   price: 209, currency: "€", colorway: "Sand",         badge: "NEW",     rating: 4.4, desc: "Cápsula de uso diario." },
];

export const FILTERS = [
  { id: "todos",       label: "Todos" },
  { id: "running",     label: "Running" },
  { id: "training",    label: "Training" },
  { id: "trail",       label: "Trail" },
  { id: "lifestyle",   label: "Lifestyle" },
  { id: "competition", label: "Competition" },
  { id: "streetwear",  label: "Streetwear" },
];

export const CATEGORIES = [
  { id: "running",    label: "Running",    count: "12" },
  { id: "streetwear", label: "Streetwear", count: "08" },
  { id: "casual",     label: "Casual",     count: "10" },
  { id: "training",   label: "Training",   count: "06" },
  { id: "luxury",     label: "Luxury",     count: "04" },
];

export const BENEFITS = [
  { k: "01", t: "Envío en 24h",      d: "Logística prioritaria desde Madrid, Berlín y Tokio sin coste para miembros AURIX.", icon: "truck"   },
  { k: "02", t: "Pago cifrado",      d: "Procesamiento PCI-DSS con tokenización en cada transacción, sin almacenar datos.",  icon: "lock"    },
  { k: "03", t: "Garantía 365 días", d: "Devolución total o crédito de tienda extendido durante un año natural completo.",   icon: "shield"  },
  { k: "04", t: "Soporte humano",    d: "Conserjería digital 7 días con respuesta media bajo 9 minutos en horario activo.",  icon: "support" },
];

export const TECH_POINTS = [
  { num: "01", t: "Aero-Weave Shell",     d: "Malla monofilamento que reduce resistencia, regula temperatura y mantiene estructura sin peso extra." },
  { num: "02", t: "Kinetic Core Midsole", d: "Compuesto infusionado con nitrógeno y placa de carbono para transferencia de energía casi inmediata." },
  { num: "03", t: "Adaptive Traction",    d: "Patrón de agarre con microcanales que ajusta contacto y estabilidad en superficies urbanas." },
];

export const NAV_LINKS = [
  { id: "technology",  label: "Technology" },
  { id: "shop",        label: "Tienda" },
  { id: "performance", label: "Performance" },
];
