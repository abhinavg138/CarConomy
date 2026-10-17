import React, { useMemo, useState } from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { INITIAL_SERVICES, SERVICE_CATEGORIES, CONSULTANCY_PACKAGES } from '../data/mockData';
import { Vehicle, ServiceItem, ConsultancyPackage } from '../types';
import { formatINR } from '../utils/formatters';
import { Eyebrow, H1, Segmented, Chip, Btn, cx } from './kit';
import { LeadRequestModal } from './LeadRequestModal';

export const Services: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const [mode, setMode] = useState<'book' | 'expert'>('book');
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState<string | null>(null);

  // Lead request modal state
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    title: string;
    category: 'Service' | 'Consultation';
    price?: number;
  }>({
    isOpen: false,
    title: '',
    category: 'Service',
  });

  const list = useMemo(
    () => INITIAL_SERVICES.filter(s => cat === 'all' || s.categoryId === cat).sort((a, b) => b.rating - a.rating),
    [cat]
  );

  const handleOpenServiceModal = (item: ServiceItem) => {
    setActiveModal({
      isOpen: true,
      title: `${item.categoryName} · ${item.providerName}`,
      category: 'Service',
      price: item.price,
    });
  };

  const handleOpenConsultModal = (pkg: ConsultancyPackage) => {
    setActiveModal({
      isOpen: true,
      title: pkg.title,
      category: 'Consultation',
      price: pkg.price,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Act</Eyebrow>
        <H1>{mode === 'book' ? `Care for your ${vehicle.make} ${vehicle.model}` : 'Talk to an expert'}</H1>
        <p className="text-xs text-mute mt-1">
          Honest pricing estimates. Submit an inquiry for advisor callbacks — no payment required upfront.
        </p>
      </div>

      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { id: 'book', label: 'Local service quotes' },
          { id: 'expert', label: 'Car buying consultation' },
        ]}
      />

      {mode === 'book' ? (
        <section>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {SERVICE_CATEGORIES.map(c => (
              <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {c.name}
              </Chip>
            ))}
          </div>

          <ul className="mt-4 max-w-4xl">
            {list.map(s => (
              <li
                key={s.id}
                className="py-5 border-b border-line grid sm:grid-cols-[1fr_auto] gap-x-8 gap-y-3 items-center"
              >
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {s.providerName}
                    {s.verified && <ShieldCheck className="w-4 h-4 text-good" aria-label="Verified" />}
                  </p>
                  <p className="text-xs text-mute mt-0.5">
                    {s.categoryName} · {s.providerType}
                  </p>
                  <p className="text-xs text-mute mt-2 num flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-warn" />
                      {s.rating} ({s.reviewsCount})
                    </span>
                    <span>{s.distanceKm} km</span>
                    <span>{s.estimatedTime}</span>
                    <span>{s.warrantyMonths}-mo warranty</span>
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <p className="num font-semibold">{formatINR(s.price)}</p>
                  <Btn variant="solid" onClick={() => handleOpenServiceModal(s)}>
                    Request Quote
                  </Btn>
                </div>
              </li>
            ))}
            {list.length === 0 && (
              <li className="py-10 text-mute text-sm">No providers in this category yet.</li>
            )}
          </ul>
        </section>
      ) : (
        <section className="max-w-4xl">
          {CONSULTANCY_PACKAGES.map(p => (
            <div key={p.id} className="py-6 border-b border-line">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="font-display text-2xl">
                    {p.title}
                    {p.badge && (
                      <span className="ml-3 align-middle text-[11px] font-sans uppercase tracking-wider text-accent border border-accent rounded-full px-2 py-0.5">
                        {p.badge}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-mute mt-1">
                    {p.duration} · {p.recommendedFor}
                  </p>
                  <p className="text-sm mt-3 leading-relaxed">{p.description}</p>
                </div>
                <div className="text-right">
                  <p className="num font-semibold text-lg">{formatINR(p.price)}</p>
                  {p.originalPrice && (
                    <p className="num text-xs text-mute line-through">{formatINR(p.originalPrice)}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-5">
                <Btn variant="solid" onClick={() => handleOpenConsultModal(p)}>
                  Request Session
                </Btn>
                <button
                  onClick={() => setOpen(open === p.id ? null : p.id)}
                  className="text-sm text-mute hover:text-ink underline underline-offset-4 cursor-pointer min-h-11"
                  aria-expanded={open === p.id}
                >
                  {open === p.id ? 'Hide' : "What's included"}
                </button>
              </div>

              {open === p.id && (
                <ul className={cx('mt-3 space-y-1.5 text-sm list-disc pl-5 text-mute')}>
                  {p.deliverables.map(d => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <LeadRequestModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal(prev => ({ ...prev, isOpen: false }))}
        title={activeModal.title}
        category={activeModal.category}
        vehicle={vehicle}
        price={activeModal.price}
      />
    </div>
  );
};
