
import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import TableCard from "@/components/admin/TableCard";

// Define the category type
interface Category {
  id: string;
  name: string;
  templateCount: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Aniversário", templateCount: 25 },
    { id: "2", name: "Casamento", templateCount: 18 },
    { id: "3", name: "Formatura", templateCount: 12 },
    { id: "4", name: "Festas", templateCount: 30 },
    { id: "5", name: "Empresarial", templateCount: 9 },
    { id: "6", name: "Infantil", templateCount: 20 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast("Erro", { description: "Nome da categoria é obrigatório" });
      return;
    }

    const newCategory: Category = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCategoryName.trim(),
      templateCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsAddDialogOpen(false);
    toast("Categoria adicionada", {
      description: `${newCategory.name} foi adicionada com sucesso.`,
    });
  };

  const handleEditCategory = () => {
    if (!selectedCategory || !newCategoryName.trim()) {
      toast("Erro", { description: "Nome da categoria é obrigatório" });
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === selectedCategory.id
        ? { ...cat, name: newCategoryName.trim() }
        : cat
    );

    setCategories(updatedCategories);
    setNewCategoryName("");
    setIsEditDialogOpen(false);
    toast("Categoria atualizada", {
      description: `Categoria atualizada para ${newCategoryName}.`,
    });
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    const updatedCategories = categories.filter(
      (cat) => cat.id !== selectedCategory.id
    );

    setCategories(updatedCategories);
    setIsDeleteDialogOpen(false);
    toast("Categoria removida", {
      description: `${selectedCategory.name} foi removida com sucesso.`,
    });
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    { key: "name", title: "Nome da Categoria" },
    { key: "templateCount", title: "Templates" },
    {
      key: "actions",
      title: "Ações",
      render: (_: any, category: Category) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteDialog(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Categorias</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <TableCard title="Categorias de Templates" columns={columns} data={categories} />

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#222222] text-white">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            <DialogDescription className="text-gray-400">
              Digite o nome da nova categoria de templates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nome da categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-[#1A1F2C] border-gray-700"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-[#1A1F2C] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-[#ea384c] hover:bg-[#ea384c]/80"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#222222] text-white">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription className="text-gray-400">
              Altere o nome da categoria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nome da categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-[#1A1F2C] border-gray-700"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-[#1A1F2C] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditCategory}
              className="bg-[#ea384c] hover:bg-[#ea384c]/80"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#222222] text-white">
          <DialogHeader>
            <DialogTitle>Remover Categoria</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja remover esta categoria?
              {selectedCategory?.templateCount > 0 && (
                <span className="block mt-2 text-[#ea384c]">
                  Atenção: Esta categoria possui {selectedCategory?.templateCount} templates vinculados.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-[#1A1F2C] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteCategory}
              variant="destructive"
              className="bg-[#ea384c] hover:bg-[#ea384c]/80"
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
