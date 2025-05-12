
import { useState } from 'react';
import { 
  Plus, Search, Edit, Trash, Eye, 
  XCircle, CheckCircle 
} from 'lucide-react';
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Mock data for templates
const mockTemplates = [
  { 
    id: '1', 
    title: 'Festa Junina 2023', 
    imageUrl: 'https://i.ibb.co/cXrsZQ9/festa-junina.jpg', 
    category: 'Festas', 
    downloads: 523, 
    status: 'ativo',
    premium: true,
    canvaLink: 'https://canva.com/design/1',
  },
  { 
    id: '2', 
    title: 'Casamento Elegante', 
    imageUrl: 'https://i.ibb.co/DgrWTrP/casamento.jpg', 
    category: 'Casamentos', 
    downloads: 487, 
    status: 'ativo',
    premium: true,
    canvaLink: 'https://canva.com/design/2',
  },
  { 
    id: '3', 
    title: 'Aniversário Infantil', 
    imageUrl: 'https://i.ibb.co/rxqFzbR/aniversario.jpg', 
    category: 'Aniversários', 
    downloads: 378, 
    status: 'ativo',
    premium: false,
    canvaLink: 'https://canva.com/design/3',
  },
  { 
    id: '4', 
    title: 'Confraternização Empresarial', 
    imageUrl: 'https://i.ibb.co/CnGXPz6/corporativo.jpg', 
    category: 'Corporativo', 
    downloads: 352, 
    status: 'ativo',
    premium: true,
    canvaLink: 'https://canva.com/design/4',
  },
  { 
    id: '5', 
    title: 'Halloween Party', 
    imageUrl: 'https://i.ibb.co/bgMnGWK/halloween.jpg', 
    category: 'Festas', 
    downloads: 301, 
    status: 'inativo',
    premium: false,
    canvaLink: 'https://canva.com/design/5',
  },
];

// Mock categories data
const categories = [
  { id: '1', name: 'Festas' },
  { id: '2', name: 'Casamentos' },
  { id: '3', name: 'Aniversários' },
  { id: '4', name: 'Corporativo' },
  { id: '5', name: 'Outros' },
];

// Form schema for template form
const templateFormSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  imageUrl: z.string().url({
    message: "Por favor, insira uma URL válida para a imagem.",
  }),
  canvaLink: z.string().url({
    message: "Por favor, insira uma URL válida para o template no Canva.",
  }),
  category: z.string({
    required_error: "Por favor, selecione uma categoria.",
  }),
  status: z.enum(["ativo", "inativo"]),
  premium: z.boolean().default(false),
});

const AdminTemplates = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      canvaLink: "",
      status: "ativo",
      premium: false,
    },
  });
  
  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateNew = () => {
    form.reset({
      title: "",
      imageUrl: "",
      canvaLink: "",
      status: "ativo",
      premium: false,
    });
    setEditingTemplate(null);
    setDialogOpen(true);
  };
  
  const handleEdit = (template: any) => {
    form.reset({
      title: template.title,
      imageUrl: template.imageUrl,
      canvaLink: template.canvaLink,
      category: template.category,
      status: template.status,
      premium: template.premium,
    });
    setEditingTemplate(template);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este template?")) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };
  
  const toggleStatus = (id: string) => {
    setTemplates(templates.map(template => 
      template.id === id 
        ? {...template, status: template.status === 'ativo' ? 'inativo' : 'ativo'} 
        : template
    ));
  };
  
  const onSubmit = (data: z.infer<typeof templateFormSchema>) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? {...template, ...data} 
          : template
      ));
    } else {
      // Create new template
      const newTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        downloads: 0,
      };
      setTemplates([...templates, newTemplate]);
    }
    
    setDialogOpen(false);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Templates</h1>
        <Button onClick={handleCreateNew} className="bg-[#ea384c] hover:bg-[#d02d3f]">
          <Plus size={16} className="mr-2" /> Novo Template
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          className="bg-[#1A1F2C] border-0 pl-10" 
          placeholder="Pesquisar templates..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-[#222222] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#1A1F2C]">
              <TableHead>Template</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id} className="hover:bg-[#1A1F2C]">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="w-10 h-16 rounded overflow-hidden mr-3">
                      <img 
                        src={template.imageUrl} 
                        alt={template.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{template.title}</span>
                  </div>
                </TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>{template.downloads}</TableCell>
                <TableCell>
                  {template.status === 'ativo' ? (
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/50">
                      Inativo
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {template.premium ? (
                    <Badge className="bg-[#ea384c]">Premium</Badge>
                  ) : (
                    <Badge className="bg-gray-600">Gratuito</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(template.id)}>
                      {template.status === 'ativo' ? (
                        <XCircle size={18} className="text-gray-400" />
                      ) : (
                        <CheckCircle size={18} className="text-emerald-500" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye size={18} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                      <Edit size={18} className="text-yellow-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}>
                      <Trash size={18} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Template Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-[#222222] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        placeholder="Nome do template" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        placeholder="https://..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      URL da imagem de capa do template (proporção 9:16)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="canvaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link no Canva</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        placeholder="https://canva.com/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#1A1F2C] border-gray-800">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1A1F2C] border-gray-800">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#1A1F2C] border-gray-800">
                            <SelectValue placeholder="Status do template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1A1F2C] border-gray-800">
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                      <FormControl>
                        <div className="flex h-10 items-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-600"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormLabel className="mt-0">Template Premium</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="bg-transparent text-white border-gray-600">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-[#ea384c] hover:bg-[#d02d3f]">
                  {editingTemplate ? 'Salvar Alterações' : 'Criar Template'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTemplates;
