import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';

const LogoPage: React.FC = () => {
  const { settings, updateSettings, uploadFile } = useAppContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    if (settings) {
      setPreview(settings.logo_url);
    }
  }, [settings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!fileToUpload) {
      toast.error('Por favor, selecciona una imagen para subir.');
      return;
    }
    const toastId = toast.loading('Actualizando logo...');
    try {
      const filePath = `public/logo-${Date.now()}`;
      const newUrl = await uploadFile(fileToUpload, 'assets', filePath);
      if (newUrl) {
        await updateSettings({ logo_url: newUrl });
        toast.success('¡Logo actualizado!', { id: toastId });
      }
    } catch (error: any) {
      toast.error(`Error al actualizar: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Gestión de Logo</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Logo de la Rifa</h2>
        <p className="text-gray-400 mb-6">Sube y actualiza el logo que se mostrará en la página principal.</p>
        <div className="space-y-6">
          <div>
            <label htmlFor="logo-upload" className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors">
              {preview ? (
                <img src={preview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-gray-400" />
                  <span className="mt-2 text-gray-400">Haz clic para subir una imagen</span>
                </>
              )}
            </label>
            <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
          <button onClick={handleSave} disabled={!preview || !fileToUpload} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
            Guardar Logo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoPage;
