/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  verseReference: string;
  verseText: string;
  language: 'es' | 'en';
}

type CardStyle = 'pergamino' | 'olivo' | 'noche';

export const VerseCardGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  verseReference,
  verseText,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('pergamino');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      renderCard();
    }
  }, [isOpen, selectedStyle, verseReference, verseText]);

  if (!isOpen) return null;

  const renderCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1350; // 4:5 Instagram / WhatsApp friendly ratio
    canvas.width = width;
    canvas.height = height;

    // Backgrounds
    if (selectedStyle === 'pergamino') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#FAF6F0');
      grad.addColorStop(0.5, '#F4EBE1');
      grad.addColorStop(1, '#ECE1D4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle border
      ctx.strokeStyle = '#D1C2AF';
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Inner corner lines
      ctx.strokeStyle = '#B8A48D';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      ctx.fillStyle = '#3D322C';
    } else if (selectedStyle === 'olivo') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#4A5D4E');
      grad.addColorStop(0.6, '#3A4A3E');
      grad.addColorStop(1, '#243027');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Golden inner border
      ctx.strokeStyle = '#FDE68A';
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, width - 100, height - 100);
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = '#FAF8F5';
    } else {
      // Noche
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#121619');
      grad.addColorStop(0.7, '#1A2128');
      grad.addColorStop(1, '#0C0F12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#3A4B5A';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      ctx.fillStyle = '#F1F5F9';
    }

    // Header Logo & Branding
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px "Cinzel", Georgia, serif';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = selectedStyle === 'olivo' ? '#FDE68A' : (selectedStyle === 'noche' ? '#BAE6FD' : '#5C4033');
    ctx.fillText('ALELUYA BIBLIA', width / 2, 160);

    // Decorative symbol / cross
    ctx.font = '32px serif';
    ctx.fillText('✦ ♰ ✦', width / 2, 220);

    // Verse text wrap
    ctx.font = 'italic 52px "Lora", Georgia, serif';
    ctx.letterSpacing = '0px';
    ctx.fillStyle = selectedStyle === 'pergamino' ? '#2E241E' : '#FFFFFF';

    const words = `«${verseText}»`.split(' ');
    const maxWidth = width - 240;
    const lineHeight = 80;
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const totalTextHeight = lines.length * lineHeight;
    let startY = (height / 2) - (totalTextHeight / 2) + 20;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), width / 2, startY + (i * lineHeight));
    }

    // Verse reference
    ctx.font = 'bold 44px "Cinzel", Georgia, serif';
    ctx.fillStyle = selectedStyle === 'olivo' ? '#FDE68A' : (selectedStyle === 'noche' ? '#FDE68A' : '#7C4A3A');
    ctx.fillText(verseReference, width / 2, startY + (lines.length * lineHeight) + 90);

    // Footer Watermark Centrado (Sin frase de offline)
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "Cinzel", Georgia, serif';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = selectedStyle === 'pergamino' ? '#8A7A6D' : '#94A3B8';
    ctx.fillText('✦ ALELUYA BIBLIA ✦', width / 2, height - 110);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Aleluya_Biblia_${verseReference.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'versiculo_aleluya_biblia.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: verseReference,
            text: `${verseReference} — ${verseText}\n— Aleluya Biblia`
          });
        } else {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  const handleCopyText = async () => {
    const fullText = `${verseReference}\n«${verseText}»\n— Aleluya Biblia`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl p-5 flex flex-col gap-4 animate-fade-in max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h2 className="text-base font-bold font-cinzel text-[var(--accent)]">
              {language === 'es' ? 'Tarjeta de Bendición' : 'Scripture Card'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'es' ? 'Comparte en WhatsApp, Instagram o guárdala' : 'Share on WhatsApp, Instagram or download'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'pergamino', label: language === 'es' ? 'Pergamino' : 'Parchment', color: '#FAF6F0' },
            { id: 'olivo', label: language === 'es' ? 'Olivo & Oro' : 'Olive & Gold', color: '#4A5D4E' },
            { id: 'noche', label: language === 'es' ? 'Noche' : 'Night', color: '#121619' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id as CardStyle)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedStyle === s.id
                  ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 scale-105'
                  : 'border-[var(--border-subtle)] hover:bg-black/5'
              }`}
            >
              <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Live Canvas Preview */}
        <div className="flex justify-center bg-black/5 p-3 rounded-xl overflow-hidden border border-[var(--border-subtle)]">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[280px] sm:max-w-[320px] rounded-lg shadow-md aspect-[4/5] object-contain"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 text-[var(--text-primary)]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (language === 'es' ? '¡Copiado!' : 'Copied!') : (language === 'es' ? 'Copiar Texto' : 'Copy Text')}</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-2.5 px-3 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 text-[var(--text-primary)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Descargar' : 'Download'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Compartir' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
