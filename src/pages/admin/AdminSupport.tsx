
import { useState } from 'react';
import { Search, User, MessageSquare, Clock, CheckCircle, XCircle, MoreVertical, Eye } from 'lucide-react';
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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Textarea } from '@/components/ui/textarea';

// Mock tickets data
const mockTickets = [
  { 
    id: '1', 
    user: 'João Silva', 
    email: 'joao@email.com',
    subject: 'Problema para baixar template',
    message: 'Estou tentando baixar o template de aniversário, mas está dando erro 404. Podem ajudar?',
    status: 'aberto',
    priority: 'média',
    createdAt: '2023-07-10T14:30:00',
    assignedTo: null,
    responses: [],
  },
  { 
    id: '2', 
    user: 'Maria Oliveira', 
    email: 'maria@email.com',
    subject: 'Dúvida sobre plano Ultimate',
    message: 'Gostaria de saber se o plano Ultimate permite o uso comercial dos templates ou apenas pessoal.',
    status: 'em_andamento',
    priority: 'baixa',
    createdAt: '2023-07-09T10:15:00',
    assignedTo: 'Admin',
    responses: [
      {
        user: 'Admin',
        message: 'Olá Maria, o plano Ultimate permite sim o uso comercial dos templates. Pode usar à vontade!',
        createdAt: '2023-07-09T11:20:00',
      }
    ],
  },
  { 
    id: '3', 
    user: 'Carlos Santos', 
    email: 'carlos@email.com',
    subject: 'Cobrança indevida',
    message: 'Fui cobrado duas vezes este mês pelo plano Ultimate. Preciso de estorno de uma das cobranças.',
    status: 'aberto',
    priority: 'alta',
    createdAt: '2023-07-08T09:45:00',
    assignedTo: null,
    responses: [],
  },
  { 
    id: '4', 
    user: 'Ana Costa', 
    email: 'ana@email.com',
    subject: 'Solicitação de novo template',
    message: 'Vocês teriam interesse em criar um template específico para chá revelação? Tenho algumas ideias.',
    status: 'fechado',
    priority: 'média',
    createdAt: '2023-07-05T16:20:00',
    assignedTo: 'Admin',
    responses: [
      {
        user: 'Admin',
        message: 'Olá Ana, adoramos sua sugestão! Estamos planejando lançar novos templates de chá revelação no próximo mês.',
        createdAt: '2023-07-06T10:30:00',
      },
      {
        user: 'Ana Costa',
        message: 'Que ótimo! Fico no aguardo então.',
        createdAt: '2023-07-06T11:15:00',
      },
      {
        user: 'Admin',
        message: 'Perfeito, assim que lançarmos avisamos você por email!',
        createdAt: '2023-07-06T13:45:00',
      }
    ],
  },
  { 
    id: '5', 
    user: 'Pedro Alves', 
    email: 'pedro@email.com',
    subject: 'Problema com edição no Canva',
    message: 'Estou com dificuldade para editar o texto no template de casamento. O texto não aparece na versão móvel.',
    status: 'em_andamento',
    priority: 'alta',
    createdAt: '2023-07-07T11:10:00',
    assignedTo: 'Admin',
    responses: [
      {
        user: 'Admin',
        message: 'Olá Pedro, pode nos dar mais detalhes sobre qual template específico está utilizando e em qual dispositivo está tentando editar?',
        createdAt: '2023-07-07T11:45:00',
      }
    ],
  },
];

// Mock admin logs
const mockAdminLogs = [
  { id: '1', admin: 'Admin', action: 'Alterou status do ticket #5', target: 'Ticket #5', timestamp: '2023-07-10T15:22:00' },
  { id: '2', admin: 'Admin', action: 'Respondeu ao ticket', target: 'Ticket #2', timestamp: '2023-07-09T11:20:00' },
  { id: '3', admin: 'Admin', action: 'Criou nova categoria', target: 'Categoria "Formatura"', timestamp: '2023-07-09T10:15:00' },
  { id: '4', admin: 'Admin', action: 'Adicionou novo template', target: 'Template "Aniversário 30 Anos"', timestamp: '2023-07-08T14:30:00' },
  { id: '5', admin: 'Admin', action: 'Alterou configurações', target: 'Configurações de Email', timestamp: '2023-07-07T09:45:00' },
];

const AdminSupport = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [logs, setLogs] = useState(mockAdminLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentTab, setCurrentTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  
  // Filter tickets based on search term and status filter
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || ticket.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
    setResponseText('');
  };
  
  const handleSendResponse = () => {
    if (!responseText.trim()) return;
    
    // Update the selected ticket with the new response
    const updatedTicket = {
      ...selectedTicket,
      status: 'em_andamento',
      assignedTo: 'Admin',
      responses: [
        ...selectedTicket.responses,
        {
          user: 'Admin',
          message: responseText,
          createdAt: new Date().toISOString(),
        }
      ]
    };
    
    // Update the tickets state
    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    ));
    
    // Add a log entry
    const newLog = {
      id: Date.now().toString(),
      admin: 'Admin',
      action: 'Respondeu ao ticket',
      target: `Ticket #${selectedTicket.id}`,
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
    
    setSelectedTicket(updatedTicket);
    setResponseText('');
  };
  
  const handleCloseTicket = (ticketId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: 'fechado' } 
        : ticket
    ));
    
    // Add a log entry
    const newLog = {
      id: Date.now().toString(),
      admin: 'Admin',
      action: 'Fechou o ticket',
      target: `Ticket #${ticketId}`,
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: 'fechado' });
    }
  };
  
  const handleReopenTicket = (ticketId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: 'aberto' } 
        : ticket
    ));
    
    // Add a log entry
    const newLog = {
      id: Date.now().toString(),
      admin: 'Admin',
      action: 'Reabriu o ticket',
      target: `Ticket #${ticketId}`,
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: 'aberto' });
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Badge className="bg-blue-500">Aberto</Badge>;
      case 'em_andamento':
        return <Badge className="bg-yellow-500">Em andamento</Badge>;
      case 'fechado':
        return <Badge className="bg-gray-500">Fechado</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <Badge className="bg-red-500">Alta</Badge>;
      case 'média':
        return <Badge className="bg-yellow-500">Média</Badge>;
      case 'baixa':
        return <Badge className="bg-green-500">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-500">{priority}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Suporte e Logs</h1>
      </div>
      
      <Tabs 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="mb-8"
      >
        <TabsList className="bg-[#1A1F2C] border-b border-gray-800 rounded-none p-0 h-auto">
          <TabsTrigger 
            value="tickets" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Tickets de Suporte
          </TabsTrigger>
          <TabsTrigger 
            value="logs" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Logs de Admin
          </TabsTrigger>
        </TabsList>
        
        {/* Tickets Tab */}
        <TabsContent value="tickets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                className="bg-[#1A1F2C] border-0 pl-10" 
                placeholder="Pesquisar tickets..." 
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
                <SelectItem value="aberto">Abertos</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="fechado">Fechados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-[#222222] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#1A1F2C]">
                  <TableHead>Usuário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Atribuído</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-[#1A1F2C]">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="bg-[#1A1F2C] p-2 rounded-full mr-3">
                          <User size={20} className="text-gray-400" />
                        </div>
                        {ticket.user}
                      </div>
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      {ticket.assignedTo || <span className="text-gray-400">Não atribuído</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={18} className="text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1A1F2C] border-gray-800 text-white">
                          <DropdownMenuItem 
                            className="hover:bg-[#222222]"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <Eye size={16} className="mr-2" /> Ver detalhes
                          </DropdownMenuItem>
                          
                          {ticket.status !== 'fechado' ? (
                            <DropdownMenuItem 
                              className="hover:bg-[#222222]"
                              onClick={() => handleCloseTicket(ticket.id)}
                            >
                              <CheckCircle size={16} className="mr-2" /> Fechar ticket
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="hover:bg-[#222222]"
                              onClick={() => handleReopenTicket(ticket.id)}
                            >
                              <Clock size={16} className="mr-2" /> Reabrir ticket
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Admin Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <div className="bg-[#222222] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#1A1F2C]">
                  <TableHead>Admin</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Alvo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-[#1A1F2C]">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="bg-[#1A1F2C] p-2 rounded-full mr-3">
                          <User size={20} className="text-gray-400" />
                        </div>
                        {log.admin}
                      </div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[700px] bg-[#222222] text-white border-gray-800">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getStatusBadge(selectedTicket.status)}
                <span>Ticket #{selectedTicket.id}: {selectedTicket.subject}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Ticket Information */}
              <Card className="bg-[#1A1F2C] border-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-400">Enviado por</p>
                      <p className="font-medium">{selectedTicket.user} ({selectedTicket.email})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Data</p>
                      <p>{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Prioridade</p>
                      <p>{getPriorityBadge(selectedTicket.priority)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Mensagem</p>
                    <p className="mt-1 p-3 bg-[#222222] rounded-lg">{selectedTicket.message}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Conversation */}
              {selectedTicket.responses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Histórico de Respostas</h3>
                  {selectedTicket.responses.map((response: any, index: number) => (
                    <Card key={index} className={`border-0 ${response.user === 'Admin' ? 'bg-[#1A1F2C]' : 'bg-[#2A303C]'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${response.user === 'Admin' ? 'bg-[#ea384c]' : 'bg-blue-600'}`}>
                              <User size={16} className="text-white" />
                            </div>
                            <p className="font-medium">{response.user}</p>
                          </div>
                          <p className="text-xs text-gray-400">{formatDate(response.createdAt)}</p>
                        </div>
                        <p>{response.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Response Form */}
              {selectedTicket.status !== 'fechado' && (
                <div>
                  <h3 className="font-medium mb-2">Responder</h3>
                  <Textarea 
                    className="bg-[#1A1F2C] border-gray-800 mb-4" 
                    placeholder="Digite sua resposta aqui..."
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="bg-transparent border-gray-700 hover:bg-[#1A1F2C]"
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                    >
                      <CheckCircle size={16} className="mr-2" /> Fechar Ticket
                    </Button>
                    
                    <Button 
                      className="bg-[#ea384c] hover:bg-[#d02d3f]"
                      disabled={!responseText.trim()}
                      onClick={handleSendResponse}
                    >
                      <MessageSquare size={16} className="mr-2" /> Enviar Resposta
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Reopen Button for Closed Tickets */}
              {selectedTicket.status === 'fechado' && (
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-gray-700 hover:bg-[#1A1F2C]"
                    onClick={() => handleReopenTicket(selectedTicket.id)}
                  >
                    <Clock size={16} className="mr-2" /> Reabrir Ticket
                  </Button>
                </div>
              )}
            </div>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" className="bg-transparent text-white border-gray-600">
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

export default AdminSupport;
