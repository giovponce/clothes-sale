import { useState, useMemo } from 'react';
import { 
  Shirt, 
  Tag, 
  Sparkles, 
  Check, 
  X, 
  Filter, 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { items } from './data/items.js';
import mushroomBanner1 from './assets/mushroom-banner.webp';
import mushroomBanner2 from './assets/mushroom-banner-2.png';
import mushroomBanner3 from './assets/mushroom-banner-3.webp';
import mushroomBanner4 from './assets/mushroom-banner-4.jpg';

const BANNERS = [mushroomBanner1, mushroomBanner2, mushroomBanner3, mushroomBanner4];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "34600000000";
const SELLER_NAME = import.meta.env.VITE_SELLER_NAME || "Giov";

function ProductCard({ item, onSelect }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const hasMultipleImages = item.imagenes && item.imagenes.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    if (item.imagenes && item.imagenes.length) {
      setCurrentImgIndex((prev) => (prev + 1) % item.imagenes.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (item.imagenes && item.imagenes.length) {
      setCurrentImgIndex((prev) => (prev - 1 + item.imagenes.length) % item.imagenes.length);
    }
  };

  const selectIndicator = (e, index) => {
    e.stopPropagation();
    setCurrentImgIndex(index);
  };

  return (
    <div 
      onClick={() => onSelect(item)}
      className="group relative bg-[#faf8f5] rounded-2xl overflow-hidden border border-warm-beige-200 hover:border-forest-green-300 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-[3/4] w-full bg-warm-beige-100 overflow-hidden select-none">
        <img
          src={`/images/${item.imagenes[currentImgIndex]}`}
          alt={`${item.nombre} - imagen ${currentImgIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            item.vendido ? 'grayscale opacity-60' : ''
          }`}
          onError={(e) => {
            // Fallback si la imagen no se encuentra (por si acaso)
            e.target.onerror = null;
            e.target.src = `https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600`;
          }}
        />

        {/* Gradiente sutil para mejorar legibilidad de controles sobre la imagen */}
        {!item.vendido && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Sello de VENDIDO */}
        {item.vendido && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <span className="bg-red-800 text-white font-extrabold text-sm md:text-base px-5 py-2.5 rounded-full shadow-lg border-2 border-white/40 tracking-widest transform -rotate-6 uppercase animate-pulse">
              Vendido
            </span>
          </div>
        )}

        {/* Controles de Carrusel (Flechas) */}
        {hasMultipleImages && !item.vendido && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImage}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-forest-green-800 hover:text-forest-green-600 transition-all shadow-md focus:outline-none"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextImage}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-forest-green-800 hover:text-forest-green-600 transition-all shadow-md focus:outline-none"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Indicadores de página de Carrusel (Puntos) */}
        {hasMultipleImages && !item.vendido && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
            {item.imagenes.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => selectIndicator(e, idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentImgIndex 
                    ? 'bg-forest-green-600 w-4' 
                    : 'bg-white/60 hover:bg-white/90'
                }`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badge de Categoría */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-forest-green-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs border border-warm-beige-200">
          {item.categoria}
        </span>
      </div>

      {/* Detalles de la Prenda */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Marca y Precio */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-green-700/80">
            {item.marca}
          </span>
          <span className="text-lg font-bold text-forest-green-900">
            ${item.precio}
          </span>
        </div>

        {/* Nombre y Label de Estado */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1 group-hover:text-forest-green-700 transition-colors flex-1">
            {item.nombre}
          </h3>
          <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 border ${
            item.new
              ? 'bg-[#e3ebe4] text-forest-green-700 border-forest-green-300'
              : 'bg-warm-beige-100 text-warm-beige-700 border-warm-beige-300'
          }`}>
            {item.new ? 'Nuevo' : 'Seminuevo'}
          </span>
        </div>

        {/* Características Rápidas */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 bg-warm-beige-100 text-forest-green-900 text-xs px-2.5 py-0.5 rounded-sm font-medium border border-warm-beige-200">
            <span className="text-stone-400 font-normal">Talla:</span> {Array.isArray(item.talla) ? item.talla.join(', ') : item.talla}
          </span>
          <span className="inline-flex items-center gap-1 bg-warm-beige-100 text-forest-green-900 text-xs px-2.5 py-0.5 rounded-sm font-medium border border-warm-beige-200">
            <span className="text-stone-400 font-normal">Color:</span> {Array.isArray(item.color) ? item.color.join(', ') : item.color}
          </span>
        </div>

        {/* Descripción corta */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-grow">
          {item.descripcion}
        </p>

        {/* Botón de acción */}
        <button 
          className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
            item.vendido
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              : 'bg-forest-green-600 text-white hover:bg-forest-green-700 active:scale-98 shadow-xs hover:shadow-md'
          }`}
          disabled={item.vendido}
        >
          {item.vendido ? (
            <>Ya Vendido</>
          ) : (
            <>
              Ver Detalles <Sparkles size={12} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // --- SELECCIÓN ALEATORIA DE BANNER ---
  const selectedBanner = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * BANNERS.length);
    return BANNERS[randomIndex];
  }, []);

  // --- ESTADOS ---
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [search, setSearch] = useState('');
  const [hideSold, setHideSold] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  // --- OBTENER OPCIONES ÚNICAS DE FILTROS ---
  const uniqueFilters = useMemo(() => {
    const tallas = new Set();
    const colores = new Set();
    const marcas = new Set();
    const categorias = new Set();

    items.forEach(item => {
      if (item.talla) {
        if (Array.isArray(item.talla)) {
          item.talla.forEach(t => tallas.add(t));
        } else {
          tallas.add(item.talla);
        }
      }
      if (item.color) {
        if (Array.isArray(item.color)) {
          item.color.forEach(c => colores.add(c));
        } else {
          colores.add(item.color);
        }
      }
      if (item.marca) marcas.add(item.marca);
      if (item.categoria) categorias.add(item.categoria);
    });

    return {
      tallas: Array.from(tallas).sort((a, b) => String(a).localeCompare(String(b), undefined, {numeric: true})),
      colores: Array.from(colores).sort(),
      marcas: Array.from(marcas).sort(),
      categorias: Array.from(categorias).sort(),
    };
  }, []);

  // --- LÓGICA DE FILTRADO COMBINADO (AND) ---
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Ignorar borradores/items vacíos
      if (!item.nombre || item.nombre.trim() === "") return false;

      // Filtro Talla (Soporta strings y arrays)
      if (talla) {
        const hasTalla = Array.isArray(item.talla)
          ? item.talla.includes(talla)
          : item.talla === talla;
        if (!hasTalla) return false;
      }
      // Filtro Color (Soporta strings y arrays)
      if (color) {
        const hasColor = Array.isArray(item.color)
          ? item.color.includes(color)
          : item.color === color;
        if (!hasColor) return false;
      }
      // Filtro Marca
      if (marca && item.marca !== marca) return false;
      // Filtro Categoría
      if (categoria && item.categoria !== categoria) return false;
      // Filtro Ocultar Vendidos
      if (hideSold && item.vendido) return false;
      // Filtro Búsqueda por texto (Nombre, Marca, Descripción, Categoría)
      if (search) {
        const query = search.toLowerCase();
        const inNombre = item.nombre.toLowerCase().includes(query);
        const inMarca = item.marca.toLowerCase().includes(query);
        const inDesc = item.descripcion.toLowerCase().includes(query);
        const inCat = item.categoria.toLowerCase().includes(query);
        if (!inNombre && !inMarca && !inDesc && !inCat) return false;
      }
      return true;
    });
  }, [talla, color, marca, categoria, hideSold, search]);

  // --- ESTADÍSTICAS RÁPIDAS ---
  const stats = useMemo(() => {
    const activeItems = items.filter(i => i.nombre && i.nombre.trim() !== "");
    const total = activeItems.length;
    const vendidos = activeItems.filter(i => i.vendido).length;
    const disponibles = total - vendidos;
    return { total, vendidos, disponibles };
  }, []);

  // --- COMPROBAR SI HAY FILTROS ACTIVOS ---
  const hasActiveFilters = useMemo(() => {
    return talla !== '' || color !== '' || marca !== '' || categoria !== '' || search !== '' || !hideSold;
  }, [talla, color, marca, categoria, search, hideSold]);

  // --- REINICIAR FILTROS ---
  const handleClearFilters = () => {
    setTalla('');
    setColor('');
    setMarca('');
    setCategoria('');
    setSearch('');
    setHideSold(true);
  };

  // --- GENERAR ENLACE WHATSAPP ---
  const getWhatsAppLink = (item) => {
    const text = `¡Hola! Me interesa muchísimo tu prenda de la venta de clóset:\n\n*${item.nombre}* (${item.marca})\nTalla: ${item.talla}\nColor: ${item.color}\nPrecio: $${item.precio}\n\n¿Sigue disponible? Me gustaría coordinar para comprarla. ¡Gracias!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-height-screen bg-warm-beige-50 selection:bg-forest-green-100 selection:text-forest-green-900 pb-16">
      
      {/* 1. ANUNCIO SUPERIOR / INFO BAR */}
      {showInfoBanner && (
        <div
          style={{ backgroundColor: '#242b1a' }}
          className="bg-forest-green-800 text-warm-beige-50 px-4 py-2 text-xs md:text-sm font-medium text-center relative flex justify-center items-center gap-2"
        >
          <span>✨ Limpieza de clóset.</span>
          <button
            onClick={() => setShowInfoBanner(false)}
            className="hover:bg-[#414833] p-1 rounded-full absolute right-2 transition-colors focus:outline-none"
            title="Cerrar aviso"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. HEADER / HERO BANNER */}
      <header
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(51, 61, 41, 0.45), rgba(36, 43, 26, 0.60)), url('${selectedBanner}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="bg-forest-green-700 text-warm-beige-50 border-b border-forest-green-800 relative overflow-hidden py-12 md:py-20"
      >
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <span
            style={{ backgroundColor: '#242b1a', borderColor: '#a4ac86' }}
            className="inline-flex items-center gap-1.5 border text-[#fbfbf9] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm"
          >
            <Heart size={12} className="fill-current text-rose-400" /> VENTA DE CLÓSET DE {SELLER_NAME.toUpperCase()}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 drop-shadow-xs">
            Venta Clóset
          </h1>
          <p className="text-base md:text-lg text-stone-100 max-w-xl mx-auto font-light leading-relaxed mb-6">
            Ropa que ya no me pongo pero sigue en excelente estado.
            <br/>Échale un ojo 👀.
          </p>

          {/* Estadísticas en la cabecera */}
          <div
            style={{ backgroundColor: '#242b1a', borderColor: '#414833' }}
            className="flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm text-white max-w-lg mx-auto p-3.5 rounded-2xl border shadow-md"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
              <span><strong>{stats.disponibles}</strong> Disponibles</span>
            </div>
            <div style={{ backgroundColor: '#414833' }} className="h-4 w-px hidden sm:block" />
            <div className="flex items-center gap-1.5 px-3 py-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a4ac86] shadow-xs" />
              <span><strong>{stats.vendidos}</strong> Vendidas</span>
            </div>
            <div style={{ backgroundColor: '#414833' }} className="h-4 w-px hidden sm:block" />
            <div className="flex items-center gap-1.5 px-3 py-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 shadow-xs" />
              <span><strong>{stats.total}</strong> Total</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. CONTENEDOR PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* BARRA DE FILTROS & BUSCADOR (STICKY) */}
        <div className="sticky top-0 z-40 bg-warm-beige-50/95 backdrop-blur-md py-4 border-b border-warm-beige-200 shadow-xs mb-8 transition-all duration-300">
          <div className="bg-white rounded-2xl p-4 border border-warm-beige-200/80 shadow-xs">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between">
              
              {/* Buscador de texto */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, marca, descripción..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 focus:ring-1 focus:ring-forest-green-500 bg-warm-beige-50/50 text-sm placeholder-stone-400 text-stone-800 transition-all"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Controles de Selección de Filtros */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 flex-[2]">
                
                {/* Categoría */}
                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-xs md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-8"
                  >
                    <option value="">Categoría (Todas)</option>
                    {uniqueFilters.categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1.5 text-[10px]">▼</div>
                </div>

                {/* Talla */}
                <div className="relative">
                  <select
                    value={talla}
                    onChange={(e) => setTalla(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-xs md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-8"
                  >
                    <option value="">Talla (Todas)</option>
                    {uniqueFilters.tallas.map(t => (
                      <option key={t} value={t}>Talla {t}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1.5 text-[10px]">▼</div>
                </div>

                {/* Color */}
                <div className="relative">
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-xs md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-8"
                  >
                    <option value="">Color (Todos)</option>
                    {uniqueFilters.colores.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1.5 text-[10px]">▼</div>
                </div>

                {/* Marca */}
                <div className="relative">
                  <select
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-xs md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-8"
                  >
                    <option value="">Marca (Todas)</option>
                    {uniqueFilters.marcas.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1.5 text-[10px]">▼</div>
                </div>

              </div>
            </div>

            {/* Fila Inferior: Checkbox Ocultar y Botón de Limpieza */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-warm-beige-100">
              
              {/* Toggle Ocultar Vendidos */}
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideSold}
                  onChange={(e) => setHideSold(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-stone-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-forest-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-green-600 relative transition-colors duration-300"></div>
                <span className="ml-3 text-xs md:text-sm font-medium text-stone-700">
                  Ocultar prendas vendidas
                </span>
              </label>

              {/* Botón de limpiar filtros */}
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1.5 text-xs text-forest-green-700 hover:text-forest-green-900 font-semibold py-1.5 px-3 rounded-lg hover:bg-forest-green-50 transition-colors focus:outline-none"
                  >
                    <RotateCcw size={13} />
                    Limpiar Filtros
                  </button>
                )}
                <span className="text-xs text-stone-500 font-medium">
                  Mostrando {filteredItems.length} de {items.length} prendas
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* CÓMO COMPRAR - SECCIÓN EXPLICATIVA */}
        <section className="bg-white rounded-2xl p-5 border border-warm-beige-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-forest-green-50 rounded-xl text-forest-green-700 flex-shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">¿Cómo reservar o comprar prendas?</h3>
              <p className="text-xs text-stone-600 max-w-xl mt-0.5">
                Navega por el catálogo, haz clic en lo que te guste para ver sus fotos completas y pulsa el botón de WhatsApp para mandarme un mensajito. Así nos ponemos de acuerdo para entrega.
              </p>
            </div>
          </div>
          <div className="w-full md:max-w-[320px] flex-shrink-0">
            <span className="inline-flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold p-3 rounded-xl leading-relaxed">
              <span className="text-sm select-none">🤝</span>
              <span>
                Entrega/Translado CasaBlanca sucursal de tu preferencia <br className="hidden md:inline" />en compras mayores a $200
              </span>
            </span>
          </div>
        </section>

        {/* CATÁLOGO - GRID DE TARJETAS */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onSelect={(selected) => setSelectedItem(selected)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-warm-beige-200 shadow-2xs max-w-xl mx-auto px-6">
            <div className="w-16 h-16 bg-warm-beige-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-warm-beige-200">
              <Shirt size={28} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">No se encontraron prendas</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
              Ninguno de los artículos coincide con la combinación de filtros aplicados. Intenta ampliar la búsqueda o restablecer la selección.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 bg-forest-green-600 hover:bg-forest-green-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-green-500"
            >
              <RotateCcw size={16} /> Ver todo el clóset
            </button>
          </div>
        )}

      </main>

      {/* 4. MODAL DE DETALLE DE PRENDA */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* Contenedor del Modal */}
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-warm-beige-100 flex flex-col md:flex-row relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar (Esquina superior derecha en móvil/escritorio) */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md transition-all focus:outline-none"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>

            {/* Lado Izquierdo: Visualizador de Imagen / Galería Carrusel */}
            <div className="w-full md:w-1/2 bg-warm-beige-50 flex flex-col justify-between relative aspect-square md:aspect-auto md:h-[600px]">
              <ModalGallery images={selectedItem.imagenes} itemNombre={selectedItem.nombre} vendido={selectedItem.vendido} />
            </div>

            {/* Lado Derecho: Información Completa y Botón WhatsApp */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full justify-between overflow-y-auto md:max-h-[600px]">
              <div>
                
                {/* Sello Vendido en Modal */}
                {selectedItem.vendido ? (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    ● ARTÍCULO YA VENDIDO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-forest-green-50 border border-forest-green-200 text-forest-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    ● DISPONIBLE
                  </span>
                )}

                {/* Marca */}
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-forest-green-700/80 mb-1">
                  {selectedItem.marca}
                </div>

                {/* Nombre de la Prenda y Label de Estado */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                    {selectedItem.nombre}
                  </h2>
                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                    selectedItem.new
                      ? 'bg-[#e3ebe4] text-forest-green-700 border-forest-green-300'
                      : 'bg-warm-beige-100 text-warm-beige-700 border-warm-beige-300'
                  }`}>
                    {selectedItem.new ? 'Nuevo' : 'Seminuevo'}
                  </span>
                </div>

                {/* Precio */}
                <div className="text-3xl font-extrabold text-forest-green-900 mb-6 flex items-baseline gap-1.5">
                  ${selectedItem.precio}
                </div>

                {/* Separador */}
                <hr className="border-warm-beige-200 mb-5" />

                {/* Ficha Técnica (Talla, Color, Categoría) */}
                <div className="grid grid-cols-3 gap-3 mb-6 bg-warm-beige-50 p-3.5 rounded-2xl border border-warm-beige-100">
                  <div className="text-center">
                    <span className="block text-[10px] uppercase font-semibold text-stone-400 tracking-wider mb-0.5">Talla</span>
                    <span className="text-sm font-bold text-stone-800">
                      {Array.isArray(selectedItem.talla) ? selectedItem.talla.join(', ') : selectedItem.talla}
                    </span>
                  </div>
                  <div className="text-center border-x border-warm-beige-200">
                    <span className="block text-[10px] uppercase font-semibold text-stone-400 tracking-wider mb-0.5">Color</span>
                    <span className="text-sm font-bold text-stone-800">
                      {Array.isArray(selectedItem.color) ? selectedItem.color.join(', ') : selectedItem.color}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] uppercase font-semibold text-stone-400 tracking-wider mb-0.5">Categoría</span>
                    <span className="text-xs font-bold text-stone-800 line-clamp-1">{selectedItem.categoria}</span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Descripción de la prenda</h4>
                  <p className="text-sm text-stone-600 leading-relaxed font-light">
                    {selectedItem.descripcion}
                  </p>
                </div>

                {/* Garantía e Higiene (Detalle sutil ecológico) */}
                <div className="space-y-2 mb-8 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-forest-green-500" />
                    <span>Lavada, desinfectada y lista para usarse.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-forest-green-500" />
                    <span>Excelente estado, sin costuras sueltas ni manchas ocultas.</span>
                  </div>
                </div>

              </div>

              {/* Botón WhatsApp */}
              <div>
                {selectedItem.vendido ? (
                  <button 
                    disabled
                    className="w-full bg-stone-100 border border-stone-200 text-stone-400 py-3.5 px-6 rounded-2xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Este artículo ya se vendió
                  </button>
                ) : (
                  <a
                    href={getWhatsAppLink(selectedItem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 focus:outline-none"
                  >
                    <MessageCircle size={18} className="fill-current" />
                    Me interesa comprarlo por WhatsApp
                    <ExternalLink size={14} />
                  </a>
                )}
                <p className="text-[10px] text-center text-stone-400 mt-2.5">
                  Se abrirá tu aplicación de WhatsApp con un mensaje pre-configurado para consultar a {SELLER_NAME}.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 border-t border-warm-beige-200 py-10 text-center text-stone-500 text-xs px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-1 text-forest-green-700 font-semibold mb-2">
            <Shirt size={16} />
            <span>Clóset Sale</span>
          </div>
          <p className="mb-4">
            Viva la moda circular.
          </p>
          <div className="h-px bg-warm-beige-200 w-16 mx-auto mb-4" />
          <p className="text-[10px] text-stone-400">
            Diseñado en tonos verde bosque y arena. Hecho con amor en React + Vite + Tailwind CSS.
          </p>
        </div>
      </footer>

    </div>
  );
}

// Subcomponente para renderizar la galería interna del modal con su propio carrusel de imágenes
function ModalGallery({ images, itemNombre, vendido }) {
  const [index, setIndex] = useState(0);

  if (!images || !images.length) return null;

  const nextImg = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-stone-100 md:rounded-l-3xl">
      <img
        src={`/images/${images[index]}`}
        alt={`${itemNombre} - detalle ${index + 1}`}
        className={`w-full h-full object-cover max-h-[40vh] md:max-h-none ${vendido ? 'grayscale opacity-50' : ''}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600`;
        }}
      />

      {/* Flechas del carrusel del modal */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImg}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 transition-all shadow-md focus:outline-none"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={nextImg}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 transition-all shadow-md focus:outline-none"
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Miniaturas en la base del visualizador */}
      {images.length > 1 && (
        <div className="absolute bottom-4 flex justify-center gap-2 bg-black/30 backdrop-blur-xs py-1.5 px-3 rounded-full">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3.5 h-3.5 rounded-full overflow-hidden border transition-all ${
                i === index 
                  ? 'border-white bg-forest-green-500 scale-110' 
                  : 'border-white/50 bg-white/50 hover:bg-white'
              }`}
              title={`Ver foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
