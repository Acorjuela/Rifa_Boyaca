import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { UploadCloud, Trash2 } from 'lucide-react';
import { Prize } from '../../types';

const PrizesPage: React.FC = () => {
  const { prizes, updatePrizes, uploadFile } = useAppContext();
  const [localPrizes, setLocalPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    setLocalPrizes(prizes);
  }, [prizes]);

  const handlePrizeUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const toastId = toast.loading(`Subiendo premio ${index + 1}...`);
      try {
        const filePath = `public/prize-${index + 1}-${Date.now()}`;
        const newUrl = await uploadFile(file, 'assets', filePath);
        if (newUrl) {
          const newPrizes = [...localPrizes];
          newPrizes[index] = { ...newPrizes[index], url: newUrl };
          setLocalPrizes(newPrizes);
          toast.success('Imagen subida', { id: toastId });
        }
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, { id: toastId });
      }
    }
  };

  const handleToggle = (index: number) => {
    const newPrizes = [...localPrizes];
    newPrizes[index].enabled = !newPrizes[index].enabled;
    setLocalPrizes(newPrizes);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      const newPrizes = [...localPrizes];
      newPrizes[index].url = null;
      setLocalPrizes(newPrizes);
      // Note: This doesn't delete from Supabase storage, just the DB link.
      // A more robust solution would involve a server-side function to delete from storage.
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading('Guardando premios...');
    try {
      await updatePrizes(localPrizes);
      toast.success('¡Imágenes de premios actualizadas!', { id: toastId });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Gestión de Premios</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Imágenes de Premios</h2>
        <p className="text-gray-400 mb-6">Sube las imágenes de los premios y activa cuáles se mostrarán en el ticket de confirmación.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localPrizes.map((prize, index) => (
            <div key={prize.id} className="bg-gray-800/50 p-4 rounded-lg flex flex-col gap-4">
              <label htmlFor={`prize-upload-${index}`} className="w-full h-36 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors">
                {prize.url ? (
                  <img src={prize.url} alt={`Prize ${index + 1} Preview`} className="max-h-full max-w-full object-contain p-2" />
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-gray-400" />
                    <span className="mt-2 text-gray-400 text-sm">Subir Premio {index + 1}</span>
                  </>
                )}
              </label>
              <input id={`prize-upload-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => handlePrizeUpload(index, e)} />
              <div className="flex justify-between items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={prize.enabled} onChange={() => handleToggle(index)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">Mostrar</span>
                </label>
                {prize.url && (
                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
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

export default PrizesPage;
