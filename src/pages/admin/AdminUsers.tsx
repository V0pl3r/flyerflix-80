
import { useState } from 'react';
import { Search, User, MoreVertical, Lock, Unlock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock users data
const mockUsers = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao@email.com', 
    status: 'ativo', 
    plan: 'ultimate', 
    joinedDate: '2023-03-15', 
    downloads: 42 
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    email: 'maria@email.com', 
    status: 'ativo', 
    plan: 'gratis', 
    joinedDate: '2023-04-22', 
    downloads: 12 
  },
  { 
    id: '3', 
    name: 'Carlos Santos', 
    email: 'carlos@email.com', 
    status: 'pendente', 
    plan: 'ultimate', 
    joinedDate: '2023-05-10', 
    downloads: 28 
  },
  { 
    id: '4', 
    name: 'Ana Costa', 
    email: 'ana@email.com', 
    status: 'cancelado', 
    plan: 'gratis', 
    joinedDate: '2023-02-05', 
    downloads: 5 
  },
  { 
    id: '5', 
    name: 'Pedro Alves', 
    email: 'pedro@email.com', 
    status: 'ativo', 
    plan: 'ultimate', 
    joinedDate: '2023-06-18', 
    downloads: 76 
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterPlan, setFilterPlan] = useState('todos');
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;
    const matchesPlan = filterPlan === 'todos' || user.plan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });
  
  const handleViewUser = (user: any) => {
    setViewingUser(user);
    setDialogOpen(true);
  };
  
  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'ativo' ? 'bloqueado' : 'ativo',
          } 
        : user
    ));
  };
  
  const handleChangePlan = (userId: string, newPlan: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, plan: newPlan } 
        : user
    ));
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-emerald-500">Ativo</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'bloqueado':
        return <Badge className="bg-red-500">Bloqueado</Badge>;
      case 'cancelado':
        return <Badge className="bg-gray-500">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'ultimate':
        return <Badge className="bg-[#ea384c]">Ultimate</Badge>;
      case 'gratis':
        return <Badge className="bg-gray-500">Grátis</Badge>;
      default:
        return <Badge className="bg-gray-500">{plan}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="bg-[#1A1F2C] border-0 pl-10" 
            placeholder="Pesquisar usuários..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          onValueChange={value => setFilterStatus(value)}
          defaultValue={filterStatus}
        >
          <SelectTrigger className="bg-[#1A1F2C] border-0">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-gray-800">
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="bloqueado">Bloqueados</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          onValueChange={value => setFilterPlan(value)}
          defaultValue={filterPlan}
        >
          <SelectTrigger className="bg-[#1A1F2C] border-0">
            <SelectValue placeholder="Filtrar por plano" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-gray-800">
            <SelectItem value="todos">Todos os planos</SelectItem>
            <SelectItem value="ultimate">Ultimate</SelectItem>
            <SelectItem value="gratis">Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-[#222222] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#1A1F2C]">
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Data de Inscrição</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-[#1A1F2C]">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="bg-[#1A1F2C] p-2 rounded-full mr-3">
                      <User size={20} className="text-gray-400" />
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{getPlanBadge(user.plan)}</TableCell>
                <TableCell>{formatDate(user.joinedDate)}</TableCell>
                <TableCell>{user.downloads}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={18} className="text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1A1F2C] border-gray-800 text-white">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem 
                        className="hover:bg-[#222222]"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye size={16} className="mr-2" /> Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="hover:bg-[#222222]"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'ativo' ? (
                          <>
                            <Lock size={16} className="mr-2" /> Bloquear usuário
                          </>
                        ) : (
                          <>
                            <Unlock size={16} className="mr-2" /> Desbloquear usuário
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuLabel>Alterar plano</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="hover:bg-[#222222]"
                        onClick={() => handleChangePlan(user.id, 'ultimate')}
                      >
                        Definir como Ultimate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="hover:bg-[#222222]"
                        onClick={() => handleChangePlan(user.id, 'gratis')}
                      >
                        Definir como Grátis
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* User Details Dialog */}
      {viewingUser && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-[#222222] text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="bg-[#1A1F2C] p-6 rounded-full inline-block mb-2">
                  <User size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold">{viewingUser.name}</h3>
                <p className="text-gray-400">{viewingUser.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p>{getStatusBadge(viewingUser.status)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Plano</p>
                  <p>{getPlanBadge(viewingUser.plan)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data de Inscrição</p>
                  <p>{formatDate(viewingUser.joinedDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Downloads Realizados</p>
                  <p>{viewingUser.downloads}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Ações</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-700 hover:bg-[#1A1F2C]"
                    onClick={() => handleToggleStatus(viewingUser.id)}
                  >
                    {viewingUser.status === 'ativo' ? (
                      <>
                        <Lock size={16} className="mr-2" /> Bloquear
                      </>
                    ) : (
                      <>
                        <Unlock size={16} className="mr-2" /> Desbloquear
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button className="bg-[#ea384c] hover:bg-[#d02d3f]">
                  Fechar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminUsers;
