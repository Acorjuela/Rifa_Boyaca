import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { AppColors } from '../../types';
import { SketchPicker, ColorResult } from 'react-color';

const ColorPickerField: React.FC<{ label: string; color: string; onChange: (color: string) => void; }> = ({ label, color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-10 rounded-lg border-2 border-gray-500 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
        />
        <span className="font-mono text-gray-400">{color}</span>
      </div>
      {displayColorPicker ? (
        <div className="absolute z-10 mt-2">
          <div className="fixed inset-0" onClick={() => setDisplayColorPicker(false)} />
          <SketchPicker color={color} onChange={(c: ColorResult) => onChange(c.hex)} />
        </div>
      ) : null}
    </div>
  );
};

const defaultColors: AppColors = {
  home: { from: '#000759', to: '#1b005b' },
  reg: { from: '#4d02b1', to: '#001187' },
  ticket: { from: '#4d02b1', to: '#001187' },
};

const ColorsPage: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [localColors, setLocalColors] = useState<AppColors | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalColors({
        ...defaultColors,
        ...(settings.colors || {}),
        home: { ...defaultColors.home, ...(settings.colors?.home || {}) },
        reg: { ...defaultColors.reg, ...(settings.colors?.reg || {}) },
        ticket: { ...defaultColors.ticket, ...(settings.colors?.ticket || {}) },
      });
    }
  }, [settings]);

  const handleColorChange = (section: keyof AppColors, part: 'from' | 'to', color: string) => {
    if (localColors) {
      setLocalColors(prev => ({
        ...prev!,
        [section]: {
          ...prev![section],
          [part]: color,
        },
      }));
    }
  };

  const handleSave = async () => {
    if (localColors) {
      const toastId = toast.loading('Guardando colores...');
      try {
        await updateSettings({ colors: localColors });
        toast.success('¡Colores guardados!', { id: toastId });
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, { id: toastId });
      }
    }
  };

  if (!localColors) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Personalización de Colores</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Gradientes de la Aplicación</h2>
        <p className="text-gray-400 mb-8">Personaliza los colores de fondo de las secciones principales de tu aplicación.</p>

        <div className="space-y-12">
          {/* Home Page Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">Página Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <ColorPickerField label="Desde (From)" color={localColors.home.from} onChange={(c) => handleColorChange('home', 'from', c)} />
              <ColorPickerField label="Hasta (To)" color={localColors.home.to} onChange={(c) => handleColorChange('home', 'to', c)} />
            </div>
          </div>

          {/* Registration Page Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">Página de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <ColorPickerField label="Desde (From)" color={localColors.reg.from} onChange={(c) => handleColorChange('reg', 'from', c)} />
              <ColorPickerField label="Hasta (To)" color={localColors.reg.to} onChange={(c) => handleColorChange('reg', 'to', c)} />
            </div>
          </div>

          {/* Ticket Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">Ticket de Confirmación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <ColorPickerField label="Desde (From)" color={localColors.ticket.from} onChange={(c) => handleColorChange('ticket', 'from', c)} />
              <ColorPickerField label="Hasta (To)" color={localColors.ticket.to} onChange={(c) => handleColorChange('ticket', 'to', c)} />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="mt-12 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
          Guardar Colores
        </button>
      </div>
    </div>
  );
};

export default ColorsPage;
