import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Ticket, User, PackageOption, Settings, Prize, Notification } from '../types';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

interface AppContextType {
  isLoading: boolean;
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'created_at' | 'is_approved'>) => Promise<void>;
  deleteTicket: (id: number) => Promise<void>;
  toggleTicketApproval: (id: number) => Promise<void>;
  occupiedNumbers: number[];
  settings: Settings | null;
  updateSettings: (updates: Partial<Omit<Settings, 'id'>>) => Promise<void>;
  packages: PackageOption[];
  updatePackages: (packagesToUpdate: PackageOption[]) => Promise<void>;
  prizes: Prize[];
  updatePrizes: (prizesToUpdate: Prize[]) => Promise<void>;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'display_order'>) => Promise<void>;
  updateNotification: (id: number, updates: Partial<Notification>) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  reorderNotifications: (notifications: Notification[]) => Promise<void>;
  uploadFile: (file: File, bucket: string, path: string) => Promise<string | null>;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [occupiedNumbers, setOccupiedNumbers] = useState<number[]>([]);

  const isAuthenticated = !!user;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const [settingsRes, packagesRes, prizesRes, notificationsRes] = await Promise.all([
        supabase.from('settings').select('*').single(),
        supabase.from('packages').select('*').order('id'),
        supabase.from('prizes').select('*').order('id'),
        supabase.from('notifications').select('*').order('display_order'),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      if (packagesRes.error) throw packagesRes.error;
      if (prizesRes.error) throw prizesRes.error;
      if (notificationsRes.error) throw notificationsRes.error;

      setSettings(settingsRes.data);
      setPackages(packagesRes.data);
      setPrizes(prizesRes.data);
      setNotifications(notificationsRes.data);

      if (session?.user) {
        const { data: ticketsData, error: ticketsError } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
        if (ticketsError) throw ticketsError;
        const allTickets = ticketsData || [];
        setTickets(allTickets);
        setOccupiedNumbers(allTickets.flatMap(t => t.numbers));
      } else {
        const { data: occupiedData, error: rpcError } = await supabase.rpc('get_occupied_numbers');
        if (rpcError) throw rpcError;
        setOccupiedNumbers(occupiedData || []);
        setTickets([]);
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(`Error al cargar datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ? { id: currentUser.id, email: currentUser.email } : null);
      fetchData();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchData]);

  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (favicon && settings?.logo_url) {
      favicon.href = settings.logo_url;
    }
  }, [settings?.logo_url]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const addTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'is_approved'>): Promise<void> => {
    const { error } = await supabase.from('tickets').insert([ticketData]);
    if (error) throw error;
    setOccupiedNumbers(prev => [...prev, ...ticketData.numbers]);
  };
  
  const deleteTicket = async (id: number) => {
    const { error } = await supabase.from('tickets').delete().match({ id });
    if (error) throw error;
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
    fetchData();
  };

  const toggleTicketApproval = async (id: number) => {
    const ticketToUpdate = tickets.find(t => t.id === id);
    if (!ticketToUpdate) return;
    const { data, error } = await supabase.from('tickets').update({ is_approved: !ticketToUpdate.is_approved }).match({ id }).select().single();
    if (error) throw error;
    if (data) setTickets(prev => prev.map(t => (t.id === id ? data : t)));
  };

  const updateSettings = async (updates: Partial<Omit<Settings, 'id'>>) => {
    const { data, error } = await supabase.from('settings').update(updates).eq('id', 1).select().single();
    if (error) throw error;
    if (data) setSettings(data);
  };

  const updatePackages = async (packagesToUpdate: PackageOption[]) => {
    const { data, error } = await supabase.from('packages').upsert(packagesToUpdate).select().order('id');
    if (error) throw error;
    if (data) setPackages(data);
  };

  const updatePrizes = async (prizesToUpdate: Prize[]) => {
    const { data, error } = await supabase.from('prizes').upsert(prizesToUpdate).select().order('id');
    if (error) throw error;
    if (data) setPrizes(data);
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  };

  // Notification Functions
  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'display_order'>) => {
    const maxOrder = notifications.reduce((max, n) => Math.max(max, n.display_order), 0);
    const { data, error } = await supabase.from('notifications').insert([{ ...notification, display_order: maxOrder + 1 }]).select().single();
    if (error) throw error;
    if (data) setNotifications(prev => [...prev, data]);
  };

  const updateNotification = async (id: number, updates: Partial<Notification>) => {
    const { data, error } = await supabase.from('notifications').update(updates).eq('id', id).select().single();
    if (error) throw error;
    if (data) setNotifications(prev => prev.map(n => n.id === id ? data : n));
  };

  const deleteNotification = async (id: number) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const reorderNotifications = async (reorderedNotifications: Notification[]) => {
    setNotifications(reorderedNotifications); // Optimistic update
    const updates = reorderedNotifications.map((n, index) => ({ id: n.id, display_order: index }));
    const { error } = await supabase.from('notifications').upsert(updates);
    if (error) {
      toast.error('Error al reordenar. Recargando...');
      fetchData(); // Revert on error
    }
  };

  const value = {
    isLoading,
    tickets, addTicket, deleteTicket, toggleTicketApproval,
    occupiedNumbers,
    settings, updateSettings,
    packages, updatePackages,
    prizes, updatePrizes,
    notifications, addNotification, updateNotification, deleteNotification, reorderNotifications,
    uploadFile,
    user, login, logout, isAuthenticated,
  };

  return (
    <AppContext.Provider value={value}>
      {isLoading && !settings ? <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white text-xl">Cargando...</div> : children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
