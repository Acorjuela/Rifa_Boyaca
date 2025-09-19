import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Ticket } from '../../types';
import ConfirmationTicket from '../../components/ConfirmationTicket';
import { Trash2, CheckCircle, Ticket as TicketIcon, DollarSign, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { tickets, deleteTicket, toggleTicketApproval } = useAppContext();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const totals = useMemo(() => {
    const totalTickets = tickets.length;
    const approvedTickets = tickets.filter(t => t.is_approved).length;
    const totalCOP = tickets
      .filter(t => t.payment_platform === 'nequi' && t.is_approved)
      .reduce((sum, t) => sum + t.total_value, 0);
    const totalUSD = tickets
      .filter(t => t.payment_platform === 'binance' && t.is_approved)
      .reduce((sum, t) => sum + t.total_value, 0);

    return { totalTickets, approvedTickets, totalCOP, totalUSD };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) {
      return tickets;
    }
    return tickets.filter(ticket =>
      `${ticket.nombre} ${ticket.apellido}`.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [tickets, searchTerm]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      try {
        await deleteTicket(id);
        toast.success('Ticket eliminado y números liberados.');
      } catch (error: any) {
        toast.error(`Error al eliminar: ${error.message}`);
      }
    }
  };
  
  const handleApprove = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await toggleTicketApproval(id);
      toast.success('Estado de aprobación actualizado.');
    } catch (error: any) {
      toast.error(`Error al aprobar: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-CO');

  const formatCOP = (amount: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  const formatUSD = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string }> = ({ icon, title, value, color }) => (
    <div className={`bg-gray-800/50 p-6 rounded-2xl flex items-center gap-4 border-l-4 ${color}`}>
      {icon}
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-cyan-300">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<TicketIcon size={32} className="text-cyan-400"/>} title="Tickets Totales" value={totals.totalTickets} color="border-cyan-400"/>
        <StatCard icon={<CheckCircle size={32} className="text-green-400"/>} title="Tickets Aprobados" value={totals.approvedTickets} color="border-green-400"/>
        <StatCard icon={<DollarSign size={32} className="text-purple-400"/>} title="Total Aprobado (COP)" value={formatCOP(totals.totalCOP)} color="border-purple-400"/>
        <StatCard icon={<DollarSign size={32} className="text-yellow-400"/>} title="Total Aprobado (USD)" value={formatUSD(totals.totalUSD)} color="border-yellow-400"/>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Listado de Tickets ({filteredTickets.length})</h2>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm p-3 pl-10 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-3">#</th>
                <th className="p-3">Nombre</th>
                <th className="p-3 hidden sm:table-cell">Fecha</th>
                <th className="p-3 hidden lg:table-cell">Referencia</th>
                <th className="p-3">Números</th>
                <th className="p-3 hidden md:table-cell">Valor</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`border-b border-gray-700 hover:bg-white/10 cursor-pointer transition-colors ${ticket.is_approved ? 'bg-green-500/10' : ''}`}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{ticket.nombre} {ticket.apellido}</td>
                  <td className="p-3 hidden sm:table-cell">{formatDate(ticket.created_at)}</td>
                  <td className="p-3 hidden lg:table-cell">{ticket.reference}</td>
                  <td className="p-3">{ticket.numbers.map(n => n.toString().padStart(3, '0')).join(' ')}</td>
                  <td className="p-3 hidden md:table-cell">
                    {ticket.payment_platform === 'nequi' ? formatCOP(ticket.total_value) : formatUSD(ticket.total_value)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => handleApprove(e, ticket.id)} className={`transition-colors ${ticket.is_approved ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-white'}`}>
                        <CheckCircle size={20} />
                      </button>
                      <button onClick={(e) => handleDelete(e, ticket.id)} className="text-red-500 hover:text-red-400 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-400">
              <p>No se encontraron tickets que coincidan con "{searchTerm}".</p>
            </div>
          )}
        </div>
      </div>

      {selectedTicket && <ConfirmationTicket isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} ticket={selectedTicket} />}
    </div>
  );
};

export default DashboardPage;
