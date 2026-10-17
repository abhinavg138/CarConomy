import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Vehicle } from '../types';
import { Btn, Eyebrow, H1 } from './kit';

interface LeadRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: 'Service' | 'Consultation';
  vehicle: Vehicle;
  price?: number;
}

export interface LeadInquiry {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  serviceTitle: string;
  category: string;
  vehicleName: string;
  preferredTime: string;
  notes?: string;
}

export const LeadRequestModal: React.FC<LeadRequestModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  vehicle,
  price,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [vehicleNotes, setVehicleNotes] = useState(`${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.variant})`);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validatePhone = (p: string) => {
    // 10 digit Indian mobile number starting with 6, 7, 8, or 9
    return /^[6-9]\d{9}$/.test(p.trim().replace(/\D/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!validatePhone(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    const inquiry: LeadInquiry = {
      id: `lead-${Date.now()}`,
      timestamp: new Date().toISOString(),
      name: name.trim(),
      phone: cleanPhone,
      serviceTitle: title,
      category,
      vehicleName: vehicleNotes,
      preferredTime,
    };

    // Save strictly to localStorage so user data is actually persisted locally
    try {
      const existing = JSON.parse(localStorage.getItem('carconomy_v5_leads') || '[]');
      existing.unshift(inquiry);
      localStorage.setItem('carconomy_v5_leads', JSON.stringify(existing));
    } catch {}

    setSubmitted(true);
  };

  const whatsappText = encodeURIComponent(
    `Hello Carconomy Advisory! I would like to request information on:\n\n*${title}*\nName: ${name.trim()}\nPhone: ${phone.trim()}\nVehicle: ${vehicleNotes}\nPreferred Time: ${preferredTime}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-2xl text-ink my-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <>
            <Eyebrow>{category === 'Consultation' ? 'Consultation Request' : 'Service Inquiry'}</Eyebrow>
            <H1 className="!text-3xl mt-1">{title}</H1>
            <p className="text-xs text-mute mt-2 leading-relaxed">
              Submit your request to receive callback and detailed pricing breakdown. We do not automatically charge your card or book slots without your spoken confirmation.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-bad/10 border border-bad/30 text-bad text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-mute mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mute mb-1">WhatsApp / Mobile Number *</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-sunk border border-line text-xs font-medium text-mute">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setError(''); }}
                    placeholder="9876543210"
                    className="flex-1 bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink num focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-mute mb-1">Vehicle Details</label>
                <input
                  type="text"
                  value={vehicleNotes}
                  onChange={e => setVehicleNotes(e.target.value)}
                  className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mute mb-1">Preferred Time for Callback</label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink cursor-pointer"
                >
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  <option value="Weekend Only">Weekend Only</option>
                </select>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
                <Btn type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Btn>
                <Btn type="submit" variant="solid">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Request
                </Btn>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-good/10 border border-good/30 flex items-center justify-center text-good">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <Eyebrow>Status: Request Logged</Eyebrow>
              <h3 className="font-display text-2xl mt-1">Inquiry Recorded Successfully</h3>
              <p className="text-xs text-mute mt-2 max-w-sm mx-auto leading-relaxed">
                Your request has been stored on this device. Note: As this is an MVP preview without direct live CRM dispatch, an advisor will review it upon operational sync.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sunk border border-line text-left text-xs space-y-1">
              <p><span className="text-mute">Service:</span> <span className="font-medium">{title}</span></p>
              <p><span className="text-mute">Contact:</span> <span className="font-medium">+91 {phone} ({name})</span></p>
              <p><span className="text-mute">Vehicle:</span> <span className="font-medium">{vehicleNotes}</span></p>
              <p><span className="text-mute">Time window:</span> <span className="font-medium">{preferredTime}</span></p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 min-h-11 text-xs font-semibold bg-[#25D366] text-black hover:opacity-95 transition-opacity"
              >
                <MessageSquare className="w-4 h-4" />
                Dispatch via WhatsApp Now
              </a>
              <Btn variant="ghost" onClick={onClose} className="text-xs">
                Close
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
