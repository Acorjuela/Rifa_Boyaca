import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PackageOption } from '../../types';
import toast from 'react-hot-toast';

const formatCOP = (value: number | string): string => {
  const num = Number(String(value).replace(/\./g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('es-CO');
};

const parseCOP = (formattedValue: string): number => {
  return Number(formattedValue.replace(/\./g, ''));
};

const PackagesPage: React.FC = () => {
  const { packages, updatePackages, settings } = useAppContext();
  const [localPackages, setLocalPackages] = useState<PackageOption[]>([]);

  useEffect(() => {
    setLocalPackages(packages);
  }, [packages]);

  const handlePackageChange = (id: number, field: 'label' | 'price_cop', value: string) => {
    setLocalPackages(prev =>
      prev.map(pkg => {
        if (pkg.id === id) {
          if (field === 'price_cop' && settings) {
            const newPriceCOP = parseCOP(value);
            const newPriceUSD = settings.usd_to_cop_rate > 0 ? newPriceCOP / settings.usd_to_cop_rate : 0;
            return { ...pkg, price_cop: newPriceCOP, price_usd: newPriceUSD };
          }
          return { ...pkg, [field]: value };
        }
        return pkg;
      })
    );
  };

  const handleSave = async () => {
    const toastId = toast.loading('Actualizando paquetes...');
    try {
      await updatePackages(localPackages);
      toast.success('¡Paquetes actualizados!', { id: toastId });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const formatUSD = (amount: number) => {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' };
    if (amount % 1 === 0) {
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 0;
    } else {
      options.minimumFractionDigits = 2;
      options.maximumFractionDigits = 2;
    }
    return amount.toLocaleString('en-US', options);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Gestión de Paquetes</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Editar Paquetes de Rifa</h2>
        <p className="text-gray-400 mb-6">Modifica los precios y etiquetas. El precio en USD se calcula automáticamente según la tasa de cambio en Ajustes.</p>
        <div className="space-y-6">
          {localPackages.map(pkg => (
            <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-800/50 p-4 rounded-lg">
              <div className="md:col-span-1">
                <label htmlFor={`label-${pkg.id}`} className="block text-sm font-medium text-gray-300 mb-1">Etiqueta</label>
                <input id={`label-${pkg.id}`} type="text" value={pkg.label} onChange={(e) => handlePackageChange(pkg.id, 'label', e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
              </div>
              <div>
                <label htmlFor={`price-${pkg.id}`} className="block text-sm font-medium text-gray-300 mb-1">Precio (COP)</label>
                <input id={`price-${pkg.id}`} type="text" value={formatCOP(pkg.price_cop)} onChange={(e) => handlePackageChange(pkg.id, 'price_cop', e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Precio (USD) <span className="text-xs">(calculado)</span></label>
                <div className="w-full p-2 bg-gray-900/50 rounded-lg text-gray-300 h-10 flex items-center">
                  {formatUSD(pkg.price_usd ?? 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default PackagesPage;
