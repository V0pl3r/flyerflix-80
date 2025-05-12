
import { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Mock categories data
const initialCategories = [
  { id: '1', name: 'Festas', templateCount: 12 },
  { id: '2', name: 'Casamentos', templateCount: 8 },
  { id: '3', name: 'Aniversários', templateCount: 15 },
  { id: '4', name: 'Corporativo', templateCount: 7 },
  { id: '5', name: 'Outros', templateCount: 3 },
];

// Form schema for category
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da categoria deve ter pelo menos 2 caracteres.",
  }),
});

const AdminCategories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const handleCreateNew = () => {
    form.reset({
      name: "",
    });
    setEditingCategory(null);
    setDialogOpen(true);
  };
  
  const handleEdit = (category: any) => {
    form.reset({
      name: category.name,
    });
    setEditingCategory(category);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    
    if (categoryToDelete && categoryToDelete.templateCount > 0) {
      alert(`Esta categoria possui ${categoryToDelete.templateCount} templates vinculados. Remova ou reclassifique os templates antes de excluir a categoria.`);
      return;
    }
    
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };
  
  const onSubmit = (data: z.infer<typeof categoryFormSchema>) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === editingCategory.id 
          ? {...category, ...data} 
          : category
      ));
    } else {
      // Create new category
      const newCategory = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        templateCount: 0,
      };
      setCategories([...categories, newCategory]);
    }
    
    setDialogOpen(false);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        <Button onClick={handleCreateNew} className="bg-[#ea384c] hover:bg-[#d02d3f]">
          <Plus size={16} className="mr-2" /> Nova Categoria
        </Button>
      </div>
      
      <div className="bg-[#222222] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#1A1F2C]">
              <TableHead>Nome</TableHead>
              <TableHead>Templates Vinculados</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-[#1A1F2C]">
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.templateCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                      <Edit size={18} className="text-yellow-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                      <Trash size={18} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Category Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-[#222222] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        placeholder="Nome da categoria" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="bg-transparent text-white border-gray-600">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-[#ea384c] hover:bg-[#d02d3f]">
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
