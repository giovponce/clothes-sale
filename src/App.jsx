import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Shirt,
  Sparkles,
  Check,
  X,
  Filter,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Heart,
  ShoppingBag,
  Trash2,
  Truck,
  Store
} from 'lucide-react';
import { items } from './data/items.js';
import mushroomBanner1 from './assets/mushroom-banner.webp';
import mushroomBanner2 from './assets/mushroom-banner-2.png';
import mushroomBanner3 from './assets/mushroom-banner-3.webp';
import mushroomBanner4 from './assets/mushroom-banner-4.jpg';

const BANNERS = [mushroomBanner1, mushroomBanner2, mushroomBanner3, mushroomBanner4];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "34600000000";
const SELLER_NAME = import.meta.env.VITE_SELLER_NAME || "Giov";

// Reglas de costos y umbrales de envío gratis
const CASA_BLANCA_FREE_THRESHOLD = 200;
const PUNTO_POST_FREE_THRESHOLD = 600;
const CASA_BLANCA_EXTRA_COST = 20;
const PUNTO_POST_EXTRA_COST = 95;

// Helper para calcular calificación de envíos
const getShippingQualification = (total) => {
  const qualifiesCasaBlanca = total >= CASA_BLANCA_FREE_THRESHOLD;
  const qualifiesPuntoPost = total >= PUNTO_POST_FREE_THRESHOLD;
  const diffCasaBlanca = Math.max(0, CASA_BLANCA_FREE_THRESHOLD - total);
  const diffPuntoPost = Math.max(0, PUNTO_POST_FREE_THRESHOLD - total);

  let statusText = '';
  if (qualifiesCasaBlanca && qualifiesPuntoPost) {
    statusText = '¡Felicidades! Calificas para envío gratis tanto por Casa Blanca como por Punto Post 🎉';
  } else if (qualifiesCasaBlanca) {
    statusText = `Calificas para entrega gratis por Casa Blanca. El envío por Punto Post sale en $${PUNTO_POST_EXTRA_COST} extra (o agrega $${diffPuntoPost} más para envío gratis por Punto Post).`;
  } else {
    statusText = `Aún no calificas para envío gratis. El envío por Punto Post sale en $${PUNTO_POST_EXTRA_COST} extra y Casa Blanca en $${CASA_BLANCA_EXTRA_COST} extra (agrega $${diffCasaBlanca} más para entrega gratis en Casa Blanca o $${diffPuntoPost} para Punto Post).`;
  }

  return {
    qualifiesCasaBlanca,
    qualifiesPuntoPost,
    diffCasaBlanca,
    diffPuntoPost,
    statusText,
  };
};

// Helpers para estado y badges de prendas
const getItemCondition = (item) => {
  if (item.condicion) return item.condicion;
  const newIds = [1, 24, 30, 38, 43, 52];
  if (newIds.includes(item.id)) return 'nuevo';
  if (item.new) return 'como-nuevo';
  return 'seminuevo';
};

const getConditionBadge = (condicion) => {
  switch (condicion) {
    case 'nuevo':
      return {
        label: 'Nuevo',
        classes: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
      };
    case 'como-nuevo':
      return {
        label: 'Como nuevo',
        classes: 'bg-[#e3ebe4] text-forest-green-700 border-forest-green-300 font-semibold'
      };
    case 'seminuevo':
    default:
      return {
        label: 'Seminuevo',
        classes: 'bg-warm-beige-100 text-warm-beige-700 border-warm-beige-300 font-semibold'
      };
  }
};

function ProductCard({ item, onSelect, inBag, onToggleBag }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const hasMultipleImages = item.imagenes && item.imagenes.length > 1;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwipedRef = useRef(false);

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

  const handleTouchStart = (e) => {
    if (!hasMultipleImages || item.vendido) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwipedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!hasMultipleImages || item.vendido) return;
    const diffX = touchStartX.current - e.touches[0].clientX;
    const diffY = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(diffX) > 15 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwipedRef.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!hasMultipleImages || item.vendido) return;
    if (isSwipedRef.current) {
      const diffX = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 40) {
        e.stopPropagation();
        if (diffX > 0) {
          nextImage(e);
        } else {
          prevImage(e);
        }
      }
    }
  };

  return (
    <div
      onClick={() => {
        if (isSwipedRef.current) {
          isSwipedRef.current = false;
          return;
        }
        onSelect(item);
      }}
      className={`group relative bg-[#faf8f5] rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full ${
        inBag ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-warm-beige-200 hover:border-forest-green-300'
      }`}
    >
      {/* Contenedor de la Imagen */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[3/4] w-full bg-warm-beige-100 overflow-hidden select-none"
      >
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

        {/* Badge en bolsa */}
        {!item.vendido && inBag && (
          <div className="absolute top-3 right-3 z-10 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-fade-in">
            <Check size={12} strokeWidth={3} /> En bolsa
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
          {(() => {
            const cond = getItemCondition(item);
            const badge = getConditionBadge(cond);
            return (
              <span className={`inline-flex items-center text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 border ${badge.classes}`}>
                {badge.label}
              </span>
            );
          })()}
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

        {/* Botones de acción */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          {item.vendido ? (
            <button 
              disabled
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200 flex items-center justify-center gap-1.5"
            >
              Ya Vendido
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBag(item);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs ${
                  inBag
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-forest-green-700 text-white hover:bg-forest-green-800 active:scale-98'
                }`}
                title={inBag ? 'Quitar de la bolsa' : 'Agregar a la bolsa'}
              >
                {inBag ? (
                  <>
                    <Check size={14} /> En bolsa
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} /> + Bolsa
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-warm-beige-100 hover:bg-warm-beige-200 text-forest-green-900 border border-warm-beige-300 transition-colors flex items-center justify-center gap-1"
                title="Ver detalles completos"
              >
                Detalles <Sparkles size={11} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente Drawer / Modal de la Bolsa de Compras
function BagDrawer({ isOpen, onClose, bagItems, onRemoveItem, onClearBag }) {
  const total = useMemo(() => {
    return bagItems.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
  }, [bagItems]);

  const shipping = useMemo(() => {
    return getShippingQualification(total);
  }, [total]);

  // Generar link de WhatsApp con todos los items
  const bagWhatsAppLink = useMemo(() => {
    if (!bagItems || bagItems.length === 0) return '';

    const itemsList = bagItems
      .map((item, idx) => {
        const tallas = Array.isArray(item.talla) ? item.talla.join(', ') : item.talla;
        const colores = Array.isArray(item.color) ? item.color.join(', ') : item.color;
        return `${idx + 1}. *${item.nombre}* (${item.marca})\n   - Talla: ${tallas} | Color: ${colores}\n   - Precio: $${item.precio}`;
      })
      .join('\n\n');

    let shippingSummary = '';
    if (shipping.qualifiesCasaBlanca && shipping.qualifiesPuntoPost) {
      shippingSummary = '📦 Califico para envío gratis por Punto Post o Casa Blanca.';
    } else if (shipping.qualifiesCasaBlanca) {
      shippingSummary = `🤝 Califico para entrega gratis por Casa Blanca (o Punto Post con $${PUNTO_POST_EXTRA_COST} de envío).`;
    } else {
      shippingSummary = `📍 Envío regular (Punto Post: $${PUNTO_POST_EXTRA_COST} extra / Casa Blanca: $${CASA_BLANCA_EXTRA_COST} extra).`;
    }

    const text = `¡Hola ${SELLER_NAME}! Me interesa apartar las siguientes prendas (${bagItems.length} ${bagItems.length === 1 ? 'prenda' : 'prendas'}) de tu venta de clóset:\n\n${itemsList}\n\n💰 *Total (${bagItems.length} prendas): $${total}*\n${shippingSummary}\n\n¿Siguen disponibles? Me gustaría coordinar para comprarlas. ¡Muchas gracias!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [bagItems, total, shipping]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col relative animate-slide-left border-l border-warm-beige-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera de la Bolsa */}
        <div className="p-4 md:p-5 border-b border-warm-beige-200 flex items-center justify-between bg-warm-beige-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-forest-green-700 text-white rounded-xl shadow-xs">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-forest-green-950 font-serif">
                Mi Bolsa de Compras
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {bagItems.length} {bagItems.length === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-beige-200 text-stone-600 hover:text-stone-900 transition-colors focus:outline-none"
            aria-label="Cerrar bolsa"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {bagItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-warm-beige-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-warm-beige-200">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">Tu bolsa está vacía</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                Agrega prendas del clóset para pedirlas todas juntas en un solo mensaje de WhatsApp.
              </p>
              <button
                onClick={onClose}
                className="bg-forest-green-700 hover:bg-forest-green-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Sección de Estado y Calificación de Envíos */}
              <div className="bg-[#faf8f5] rounded-2xl p-4 border border-warm-beige-300 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-green-800">
                    Información de Envío
                  </span>
                  <span className="text-xs font-extrabold text-forest-green-900 bg-warm-beige-200/70 px-2 py-0.5 rounded-md">
                    Subtotal: ${total}
                  </span>
                </div>

                {/* Banner de Calificación Principal */}
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  shipping.qualifiesCasaBlanca && shipping.qualifiesPuntoPost
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : shipping.qualifiesCasaBlanca
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-warm-beige-100 border-warm-beige-300 text-stone-800'
                }`}>
                  <p className="font-semibold">
                    {shipping.statusText}
                  </p>
                </div>

                {/* Detalle por tipo de entrega */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {/* Tarjeta Casa Blanca */}
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                    shipping.qualifiesCasaBlanca 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                      : 'bg-stone-50 border-warm-beige-200 text-stone-700'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Store size={13} className="text-forest-green-700" /> Casa Blanca
                      </span>
                      {shipping.qualifiesCasaBlanca ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                          ¡GRATIS!
                        </span>
                      ) : (
                        <span className="text-stone-500 font-semibold text-[10px]">
                          +$20 extra
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-600">
                      {shipping.qualifiesCasaBlanca 
                        ? 'Compras ≥ $200' 
                        : `Te faltan $${shipping.diffCasaBlanca} para gratis`}
                    </span>
                  </div>

                  {/* Tarjeta Punto Post */}
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                    shipping.qualifiesPuntoPost 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                      : 'bg-stone-50 border-warm-beige-200 text-stone-700'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Truck size={13} className="text-forest-green-700" /> Punto Post
                      </span>
                      {shipping.qualifiesPuntoPost ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                          ¡GRATIS!
                        </span>
                      ) : (
                        <span className="text-stone-500 font-semibold text-[10px]">
                          +$95 extra
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-600">
                      {shipping.qualifiesPuntoPost 
                        ? 'Compras ≥ $600 a todo México' 
                        : `Te faltan $${shipping.diffPuntoPost} para gratis`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de Prendas en la bolsa */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Prendas en tu lista ({bagItems.length})
                  </span>
                  <button
                    onClick={onClearBag}
                    className="text-[11px] text-red-600 hover:text-red-800 font-semibold transition-colors"
                  >
                    Vaciar bolsa
                  </button>
                </div>

                {bagItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-warm-beige-200 shadow-2xs hover:border-warm-beige-300 transition-all"
                  >
                    {/* Miniatura */}
                    <img
                      src={`/images/${item.imagenes[0]}`}
                      alt={item.nombre}
                      className="w-16 h-20 object-cover rounded-xl bg-warm-beige-100 flex-shrink-0 border border-warm-beige-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600`;
                      }}
                    />

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-forest-green-700/80">
                        {item.marca}
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.nombre}
                      </h4>
                      <div className="flex flex-wrap gap-1 my-1 text-[10px] text-stone-600">
                        <span className="bg-warm-beige-100 px-1.5 py-0.5 rounded">
                          Talla: {Array.isArray(item.talla) ? item.talla.join(', ') : item.talla}
                        </span>
                        <span className="bg-warm-beige-100 px-1.5 py-0.5 rounded">
                          Color: {Array.isArray(item.color) ? item.color.join(', ') : item.color}
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-forest-green-900">
                        ${item.precio}
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors focus:outline-none flex-shrink-0"
                      title="Quitar de la bolsa"
                      aria-label="Quitar prenda"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pie de la bolsa con Checkout por WhatsApp */}
        {bagItems.length > 0 && (
          <div className="p-4 md:p-5 border-t border-warm-beige-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-stone-800">
              <span className="text-xs font-medium">Total de prendas ({bagItems.length}):</span>
              <span className="text-xl font-extrabold text-forest-green-950">${total}</span>
            </div>

            <a
              href={bagWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white py-3.5 px-5 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 focus:outline-none"
            >
              <MessageCircle size={18} className="fill-current" />
              Enviar pedido por WhatsApp (${total})
              <ExternalLink size={14} />
            </a>

            <p className="text-[10px] text-center text-stone-400 leading-tight">
              Se enviará la lista completa de {bagItems.length} prendas a WhatsApp para apartarlas y coordinar entrega con {SELLER_NAME}.
            </p>
          </div>
        )}
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

  // --- ESTADO DE LA BOLSA DE COMPRAS (con persistencia en localStorage) ---
  const [bag, setBag] = useState(() => {
    try {
      const saved = localStorage.getItem('closet_sale_bag');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('closet_sale_bag', JSON.stringify(bag));
    } catch {
      // Ignorar fallas de localStorage
    }
  }, [bag]);

  // Lista completa de objetos prenda en la bolsa
  const bagItems = useMemo(() => {
    return bag
      .map(id => items.find(item => item.id === id))
      .filter(item => item && !item.vendido);
  }, [bag]);

  const bagTotal = useMemo(() => {
    return bagItems.reduce((sum, item) => sum + (Number(item.precio) || 0), 0);
  }, [bagItems]);

  const isInBag = (itemId) => bag.includes(itemId);

  const toggleBagItem = (item) => {
    if (item.vendido) return;
    setBag(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
  };

  const removeFromBag = (itemId) => {
    setBag(prev => prev.filter(id => id !== itemId));
  };

  const clearBag = () => {
    setBag([]);
  };

  // --- ESTADOS DE FILTROS ---
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [search, setSearch] = useState('');
  const [hideSold, setHideSold] = useState(true);
  const [condicion, setCondicion] = useState(''); // '' (todos), 'nuevo', 'como-nuevo', 'seminuevo'
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Cerrar modales con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setIsBagOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // --- ORDEN ALEATORIO (Fisher-Yates, una vez por carga de página) ---
  const shuffledItems = useMemo(() => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // --- LÓGICA DE FILTRADO COMBINADO (AND) ---
  const filteredItems = useMemo(() => {
    return shuffledItems.filter(item => {
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
      // Filtro de Estado (Nuevo / Como nuevo / Seminuevo)
      if (condicion) {
        const itemCond = getItemCondition(item);
        if (itemCond !== condicion) return false;
      }
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
  }, [shuffledItems, talla, color, marca, categoria, hideSold, search, condicion]);

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
    return talla !== '' || color !== '' || marca !== '' || categoria !== '' || search !== '' || !hideSold || condicion !== '';
  }, [talla, color, marca, categoria, search, hideSold, condicion]);

  // --- REINICIAR FILTROS ---
  const handleClearFilters = () => {
    setTalla('');
    setColor('');
    setMarca('');
    setCategoria('');
    setSearch('');
    setCondicion('');
    setHideSold(true);
  };

  // --- GENERAR ENLACE WHATSAPP INDIVIDUAL ---
  const getWhatsAppLink = (item) => {
    const text = `¡Hola! Me interesa muchísimo tu prenda de la venta de clóset:\n\n*${item.nombre}* (${item.marca})\nTalla: ${item.talla}\nColor: ${item.color}\nPrecio: $${item.precio}\n\n¿Sigue disponible? Me gustaría coordinar para comprarla. ¡Gracias!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-height-screen bg-warm-beige-50 selection:bg-forest-green-100 selection:text-forest-green-900 pb-20">
      
      {/* 1. ANUNCIO SUPERIOR / INFO BAR */}
      {showInfoBanner && (
        <div
          style={{ backgroundColor: '#242b1a' }}
          className="bg-forest-green-800 text-warm-beige-50 px-4 py-2 text-xs md:text-sm font-medium text-center relative flex justify-center items-center gap-2"
        >
          <span>✨ Limpieza de clóset. Entrega gratis en compras mayores a $200 (Casa Blanca) o $600 (Punto Post).</span>
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
            <br/>Agrega varias prendas a tu bolsa y haz tu pedido junto por WhatsApp.
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
        
        {/* BARRA DE FILTROS & BUSCADOR & BOTÓN BOLSA (STICKY) */}
        <div className="sticky top-0 z-40 bg-warm-beige-50/95 backdrop-blur-md py-2 md:py-3.5 border-b border-warm-beige-200 shadow-xs mb-4 md:mb-8 transition-all duration-300">
          <div className="bg-white rounded-2xl p-2.5 md:p-4 border border-warm-beige-200/80 shadow-xs">
            <div className="flex flex-col lg:flex-row gap-2.5 lg:gap-4 items-stretch justify-between">
              
              {/* Buscador, Filtros y Botón de Bolsa */}
              <div className="flex gap-2 items-center flex-1">
                {/* Buscador de texto */}
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 md:py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 focus:ring-1 focus:ring-forest-green-500 bg-warm-beige-50/50 text-xs md:text-sm placeholder-stone-400 text-stone-800 transition-all"
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

                {/* Botón Filtros Móvil */}
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`lg:hidden flex items-center justify-center gap-1.5 px-3 py-2 md:py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${
                    showMobileFilters || hasActiveFilters
                      ? 'bg-forest-green-600 border-forest-green-600 text-white shadow-xs'
                      : 'border-warm-beige-200 text-stone-700 bg-warm-beige-50/30 hover:bg-warm-beige-50'
                  }`}
                >
                  <Filter size={14} />
                  <span>Filtros</span>
                  {hasActiveFilters && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>

                {/* Botón de Bolsa en Barra Superior */}
                <button
                  type="button"
                  onClick={() => setIsBagOpen(true)}
                  className="flex items-center justify-center gap-2 px-3 py-2 md:py-2.5 rounded-xl bg-forest-green-700 hover:bg-forest-green-800 text-white text-xs font-bold transition-all shadow-xs active:scale-98 relative"
                  title="Abrir bolsa de compras"
                >
                  <ShoppingBag size={15} />
                  <span className="hidden sm:inline">Bolsa</span>
                  <span className="bg-emerald-500 text-forest-green-950 font-black text-[11px] px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                    {bagItems.length}
                  </span>
                </button>
              </div>

              {/* Controles de Selección de Filtros (Categoría, Talla, Color, Marca) */}
              <div className={`${showMobileFilters ? 'grid' : 'hidden'} lg:grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 flex-[2]`}>
                
                {/* Categoría */}
                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-2.5 py-2 md:px-3 md:py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-[11px] md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-7 md:pr-8"
                  >
                    <option value="">Categoría (Todas)</option>
                    {uniqueFilters.categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1 md:pl-1.5 text-[9px] md:text-[10px]">▼</div>
                </div>

                {/* Talla */}
                <div className="relative">
                  <select
                    value={talla}
                    onChange={(e) => setTalla(e.target.value)}
                    className="w-full px-2.5 py-2 md:px-3 md:py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-[11px] md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-7 md:pr-8"
                  >
                    <option value="">Talla (Todas)</option>
                    {uniqueFilters.tallas.map(t => (
                      <option key={t} value={t}>Talla {t}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1 md:pl-1.5 text-[9px] md:text-[10px]">▼</div>
                </div>

                {/* Color */}
                <div className="relative">
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-2.5 py-2 md:px-3 md:py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-[11px] md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-7 md:pr-8"
                  >
                    <option value="">Color (Todos)</option>
                    {uniqueFilters.colores.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1 md:pl-1.5 text-[9px] md:text-[10px]">▼</div>
                </div>

                {/* Marca */}
                <div className="relative">
                  <select
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full px-2.5 py-2 md:px-3 md:py-2.5 rounded-xl border border-warm-beige-200 focus:outline-none focus:border-forest-green-500 bg-white text-[11px] md:text-sm text-stone-700 font-medium cursor-pointer transition-all appearance-none pr-7 md:pr-8"
                  >
                    <option value="">Marca (Todas)</option>
                    {uniqueFilters.marcas.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 border-l border-warm-beige-200 pl-1 md:pl-1.5 text-[9px] md:text-[10px]">▼</div>
                </div>

              </div>
            </div>

            {/* Fila Inferior: Checkbox Ocultar y Botón de Limpieza */}
            <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-warm-beige-100`}>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Toggle Ocultar Vendidos */}
                <label className="inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hideSold}
                    onChange={(e) => setHideSold(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-5 bg-stone-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-forest-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest-green-600 relative transition-colors duration-300"></div>
                  <span className="ml-2.5 text-xs md:text-sm font-medium text-stone-700">
                    Ocultar vendidos
                  </span>
                </label>

                {/* Separador vertical en escritorio */}
                <div className="hidden sm:block w-px h-5 bg-warm-beige-200" />

                {/* Control Segmentado para ver Estado: Todos / Nuevos / Como nuevos / Seminuevos */}
                <div className="flex items-center bg-warm-beige-100/90 p-0.5 rounded-lg border border-warm-beige-200 shadow-2xs">
                  <button
                    onClick={() => setCondicion('')}
                    className={`text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md transition-all cursor-pointer ${
                      condicion === ''
                        ? 'bg-forest-green-600 text-white shadow-3xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setCondicion('nuevo')}
                    className={`text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md transition-all cursor-pointer ${
                      condicion === 'nuevo'
                        ? 'bg-forest-green-600 text-white shadow-3xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Nuevos
                  </button>
                  <button
                    onClick={() => setCondicion('como-nuevo')}
                    className={`text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md transition-all cursor-pointer ${
                      condicion === 'como-nuevo'
                        ? 'bg-forest-green-600 text-white shadow-3xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Como nuevos
                  </button>
                  <button
                    onClick={() => setCondicion('seminuevo')}
                    className={`text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md transition-all cursor-pointer ${
                      condicion === 'seminuevo'
                        ? 'bg-forest-green-600 text-white shadow-3xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Seminuevos
                  </button>
                </div>
              </div>

              {/* Botón de limpiar filtros */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 text-[11px] md:text-xs text-forest-green-700 hover:text-forest-green-900 font-semibold py-1 md:py-1.5 px-2 md:px-3 rounded-lg hover:bg-forest-green-50 transition-colors focus:outline-none"
                  >
                    <RotateCcw size={12} />
                    Limpiar
                  </button>
                )}
                <span className="text-[11px] md:text-xs text-stone-500 font-medium">
                  {filteredItems.length} de {items.length} prendas
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* CÓMO COMPRAR - SECCIÓN EXPLICATIVA */}
        <section className="bg-white rounded-2xl p-5 border border-warm-beige-200 mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-forest-green-50 rounded-xl text-forest-green-700 flex-shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">¿Cómo funciona la bolsa de compras?</h3>
              <p className="text-xs text-stone-600 max-w-xl mt-0.5">
                Presiona <strong>+ Bolsa</strong> en las prendas que te gusten para agregarlas. Al finalizar, abre tu bolsa para enviar un solo mensaje de WhatsApp con todo tu pedido.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full xl:w-auto">
            <div className="flex-1 sm:max-w-[280px] bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold p-3 rounded-xl leading-relaxed flex items-start gap-2">
              <Store size={18} className="shrink-0 mt-0.5 text-amber-700" />
              <span>
                <strong>Casa Blanca:</strong> Entrega gratis en compras &gt; $200 (o $20 extra).
              </span>
            </div>
            <div className="flex-1 sm:max-w-[280px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3 rounded-xl leading-relaxed flex items-start gap-2">
              <Truck size={18} className="shrink-0 mt-0.5 text-emerald-700" />
              <span>
                <strong>Punto Post:</strong> Envío nacional gratis en compras &gt; $600 (o $95 extra).
              </span>
            </div>
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
                inBag={isInBag(item.id)}
                onToggleBag={toggleBagItem}
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

      {/* 4. BOTÓN FLOTANTE DE LA BOLSA (FAB) */}
      {bagItems.length > 0 && (
        <div className="fixed bottom-5 right-5 z-40 animate-fade-in">
          <button
            onClick={() => setIsBagOpen(true)}
            className="flex items-center gap-3 bg-forest-green-800 hover:bg-forest-green-900 text-white px-5 py-3.5 rounded-full shadow-2xl border-2 border-emerald-400/40 hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Abrir bolsa de compras"
          >
            <div className="relative">
              <ShoppingBag size={22} />
              <span className="absolute -top-2 -right-2 bg-emerald-400 text-forest-green-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {bagItems.length}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight">Mi Bolsa</span>
              <span className="text-[11px] text-emerald-200 font-semibold leading-tight">${bagTotal}</span>
            </div>
          </button>
        </div>
      )}

      {/* 5. MODAL DE DETALLE DE PRENDA */}
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
            {/* Botón Cerrar */}
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

            {/* Lado Derecho: Información Completa y Botones */}
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
                  {(() => {
                    const cond = getItemCondition(selectedItem);
                    const badge = getConditionBadge(cond);
                    return (
                      <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border ${badge.classes}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
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

                {/* Garantía e Higiene */}
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

              {/* Botones de Acción en el Modal */}
              <div>
                {selectedItem.vendido ? (
                  <button 
                    disabled
                    className="w-full bg-stone-100 border border-stone-200 text-stone-400 py-3.5 px-6 rounded-2xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Este artículo ya se vendió
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Botón Principal: Agregar / Quitar de la bolsa */}
                    <button
                      onClick={() => toggleBagItem(selectedItem)}
                      className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                        isInBag(selectedItem.id)
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-forest-green-700 hover:bg-forest-green-800 text-white active:scale-98'
                      }`}
                    >
                      {isInBag(selectedItem.id) ? (
                        <>
                          <Check size={18} />
                          En tu bolsa (Clic para quitar)
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          Agregar a la bolsa
                        </>
                      )}
                    </button>

                    {/* Botón Ver Bolsa si hay prendas */}
                    {bagItems.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedItem(null);
                          setIsBagOpen(true);
                        }}
                        className="w-full bg-warm-beige-100 hover:bg-warm-beige-200 text-forest-green-900 border border-warm-beige-300 py-2.5 px-4 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={15} />
                        Ver mi bolsa ({bagItems.length} {bagItems.length === 1 ? 'prenda' : 'prendas'}) y pedir por WhatsApp
                      </button>
                    )}

                    {/* Link para comprar solo este artículo */}
                    <a
                      href={getWhatsAppLink(selectedItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25d366]/10 hover:bg-[#25d366]/20 text-emerald-800 border border-emerald-300 py-2.5 px-4 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={15} className="text-[#25d366] fill-current" />
                      Comprar solo esta prenda por WhatsApp
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
                <p className="text-[10px] text-center text-stone-400 mt-2.5">
                  Agrega varias prendas para calificar para envío gratis por Casa Blanca ($200) o Punto Post ($600).
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. DRAWER / MODAL DE LA BOLSA DE COMPRAS */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        bagItems={bagItems}
        onRemoveItem={removeFromBag}
        onClearBag={clearBag}
      />

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
  const scrollContainerRef = useRef(null);

  // Sincronizar el scroll cuando cambia la imagen seleccionada desde fuera
  useEffect(() => {
    setIndex(0);
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = 0;
    }
  }, [images]);

  if (!images || !images.length) return null;

  // Manejar el scroll manual (deslizamiento táctil en móvil)
  const handleScroll = (e) => {
    const container = e.currentTarget;
    const width = container.getBoundingClientRect().width;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== index && newIndex >= 0 && newIndex < images.length) {
        setIndex(newIndex);
      }
    }
  };

  const scrollToImage = (targetIndex) => {
    const container = scrollContainerRef.current;
    if (container) {
      const width = container.getBoundingClientRect().width;
      container.scrollTo({
        left: targetIndex * width,
        behavior: 'smooth'
      });
      setIndex(targetIndex);
    }
  };

  const nextImg = () => {
    const nextIndex = (index + 1) % images.length;
    scrollToImage(nextIndex);
  };

  const prevImg = () => {
    const prevIndex = (index - 1 + images.length) % images.length;
    scrollToImage(prevIndex);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-stone-100 md:rounded-l-3xl">
      {/* Contenedor deslizable horizontalmente (scroll horizontal nativo en móviles) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="w-full h-full shrink-0 snap-center flex justify-center items-center"
          >
            <img
              src={`/images/${img}`}
              alt={`${itemNombre} - detalle ${i + 1}`}
              className={`w-full h-full object-cover max-h-[40vh] md:max-h-none ${vendido ? 'grayscale opacity-50' : ''}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600`;
              }}
            />
          </div>
        ))}
      </div>

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
              onClick={() => scrollToImage(i)}
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
