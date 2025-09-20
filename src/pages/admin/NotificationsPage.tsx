import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Notification } from '../../types';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Trash2, UploadCloud, Video, PlusCircle, Edit, ArrowUp, ArrowDown } from 'lucide-react';

const NotificationForm: React.FC<{ notification?: Notification; onSave: (data: any) => void; onCancel: () => void; }> = ({ notification, onSave, onCancel }) => {
  const [title, setTitle] = useState(notification?.title || '');
  const [description, setDescription] = useState(notification?.description || '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(notification?.video_url || null);
  const { uploadFile } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let video_url = notification?.video_url;
    if (videoFile) {
      setIsUploading(true);
      const toastId = toast.loading('Subiendo video...');
      try {
        const filePath = `public/notification-${Date.now()}`;
        video_url = await uploadFile(videoFile, 'assets', filePath);
        toast.success('Video subido', { id: toastId });
      } catch (error: any) {
        toast.error(`Error al subir: ${error.message}`, { id: toastId });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    onSave({ title, description, video_url });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{notification ? 'Editar' : 'Crear'} Notificación</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full p-2 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Video</label>
        <input type="file" id="video-upload" accept="video/*" onChange={handleVideoChange} className="hidden" />
        <label htmlFor="video-upload" className="w-full h-32 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-colors">
          {videoPreview ? (
            <video src={videoPreview} className="max-h-full max-w-full object-contain" controls />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-gray-400 text-sm">Subir video</span>
            </>
          )}
        </label>
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="py-2 px-4 font-semibold text-gray-300 hover:bg-gray-700 rounded-lg">Cancelar</button>
        <button type="submit" disabled={isUploading} className="py-2 px-4 font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:bg-gray-500">{isUploading ? 'Subiendo...' : 'Guardar'}</button>
      </div>
    </form>
  );
};

const NotificationsPage: React.FC = () => {
  const { notifications, addNotification, updateNotification, deleteNotification, reorderNotifications } = useAppContext();
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(notifications);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    reorderNotifications(items);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === notifications.length - 1)) {
      return;
    }
    const items = Array.from(notifications);
    const [movedItem] = items.splice(index, 1);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    items.splice(newIndex, 0, movedItem);
    reorderNotifications(items);
  };

  const handleCreate = async (data: any) => {
    const toastId = toast.loading('Creando notificación...');
    try {
      await addNotification({ title: data.title, description: data.description, video_url: data.video_url, is_enabled: true });
      toast.success('Notificación creada', { id: toastId });
      setIsCreating(false);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingNotification) return;
    const toastId = toast.loading('Actualizando...');
    try {
      await updateNotification(editingNotification.id, { title: data.title, description: data.description, video_url: data.video_url });
      toast.success('Notificación actualizada', { id: toastId });
      setEditingNotification(null);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      const toastId = toast.loading('Eliminando...');
      try {
        await deleteNotification(id);
        toast.success('Notificación eliminada', { id: toastId });
      } catch (error: any) {
        toast.error(`Error: ${error.message}`, { id: toastId });
      }
    }
  };
  
  const handleToggle = async (notification: Notification) => {
      await updateNotification(notification.id, { is_enabled: !notification.is_enabled });
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-cyan-300">Gestión de Notificaciones</h1>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 py-2 px-4 font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg">
          <PlusCircle size={20} /> Crear Nueva
        </button>
      </div>

      {isCreating && <NotificationForm onSave={handleCreate} onCancel={() => setIsCreating(false)} />}
      {editingNotification && <NotificationForm notification={editingNotification} onSave={handleUpdate} onCancel={() => setEditingNotification(null)} />}

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Notificaciones Activas</h2>
        <p className="text-gray-400 mb-6">Arrastra para reordenar. Estas notificaciones aparecerán en un modal en la página principal.</p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="notifications">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {notifications.map((n, index) => (
                  <Draggable key={n.id} draggableId={String(n.id)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-lg">
                        <div {...provided.dragHandleProps} className="cursor-grab">
                          <GripVertical className="text-gray-500" />
                        </div>
                        <div className="flex-shrink-0 w-20 h-12 bg-black rounded-md flex items-center justify-center">
                          {n.video_url ? <video src={n.video_url} className="w-full h-full object-cover" /> : <Video className="text-gray-500" size={24} />}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold">{n.title}</h4>
                          <p className="text-sm text-gray-400 truncate">{n.description}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                           <div className="flex flex-col">
                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white">
                              <ArrowUp size={16} />
                            </button>
                            <button onClick={() => handleMove(index, 'down')} disabled={index === notifications.length - 1} className="disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white">
                              <ArrowDown size={16} />
                            </button>
                          </div>
                          <button onClick={() => setEditingNotification(n)} className="text-gray-400 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={n.is_enabled} onChange={() => handleToggle(n)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                          </label>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default NotificationsPage;
