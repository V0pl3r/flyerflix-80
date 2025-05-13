
import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Link, ExternalLink, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import TableCard from "@/components/admin/TableCard";

// Define template interface
interface Template {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  downloads: number;
  status: string;
  premium: boolean;
  canvaLink: string;
  isForFreePlan: boolean;
  isForUltimatePlan: boolean;
}

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      title: "Template Aniversário Modern",
      imageUrl: "/placeholder.svg",
      category: "Aniversário",
      downloads: 1245,
      status: "ativo",
      premium: true,
      canvaLink: "https://canva.com/design/template1",
      isForFreePlan: false,
      isForUltimatePlan: true,
    },
    {
      id: "2",
      title: "Convite de Casamento Elegante",
      imageUrl: "/placeholder.svg",
      category: "Casamento",
      downloads: 986,
      status: "ativo",
      premium: true,
      canvaLink: "https://canva.com/design/template2",
      isForFreePlan: false,
      isForUltimatePlan: true,
    },
    {
      id: "3",
      title: "Flyer de Formatura",
      imageUrl: "/placeholder.svg",
      category: "Formatura",
      downloads: 574,
      status: "ativo",
      premium: false,
      canvaLink: "https://canva.com/design/template3",
      isForFreePlan: true,
      isForUltimatePlan: true,
    },
    {
      id: "4",
      title: "Festa Neon Flyer",
      imageUrl: "/placeholder.svg",
      category: "Festas",
      downloads: 1050,
      status: "inativo",
      premium: false,
      canvaLink: "https://canva.com/design/template4",
      isForFreePlan: true,
      isForUltimatePlan: true,
    }
  ]);

  const categories = [
    "Aniversário",
    "Casamento",
    "Formatura",
    "Festas",
    "Empresarial",
    "Infantil",
  ];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [newTemplate, setNewTemplate] = useState<Template>({
    id: "",
    title: "",
    imageUrl: "/placeholder.svg",
    category: "",
    downloads: 0,
    status: "ativo",
    premium: false,
    canvaLink: "",
    isForFreePlan: false,
    isForUltimatePlan: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file format
      const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedFormats.includes(file.type)) {
        toast("Formato inválido", {
          description: "Por favor, selecione uma imagem JPG, PNG ou WEBP.",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          
          // In a real application, you would upload this to a storage service
          // and get back a URL. Here we'll just use the data URL as placeholder.
          setNewTemplate({
            ...newTemplate,
            imageUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Template
  ) => {
    setNewTemplate({ ...newTemplate, [field]: e.target.value });
  };

  const handleSelectChange = (value: string, field: keyof Template) => {
    setNewTemplate({ ...newTemplate, [field]: value });
  };

  const handleCheckboxChange = (checked: boolean, field: keyof Template) => {
    setNewTemplate({ ...newTemplate, [field]: checked });
  };

  const validateTemplate = () => {
    if (!newTemplate.title) {
      toast("Campo obrigatório", { description: "O título do template é obrigatório." });
      return false;
    }
    
    if (!newTemplate.category) {
      toast("Campo obrigatório", { description: "A categoria do template é obrigatória." });
      return false;
    }
    
    if (!newTemplate.canvaLink) {
      toast("Campo obrigatório", { description: "O link do Canva é obrigatório." });
      return false;
    }
    
    if (isAddDialogOpen && !selectedImage) {
      toast("Imagem obrigatória", { description: "Adicione uma imagem de capa para o template." });
      return false;
    }
    
    return true;
  };

  const handleAddTemplate = () => {
    if (!validateTemplate()) return;

    const templateToAdd: Template = {
      ...newTemplate,
      id: Math.random().toString(36).substring(2, 9),
    };

    setTemplates([...templates, templateToAdd]);
    setIsAddDialogOpen(false);
    resetNewTemplate();
    toast("Template adicionado", {
      description: `${templateToAdd.title} foi adicionado com sucesso.`,
    });
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate || !validateTemplate()) return;

    const updatedTemplates = templates.map((template) =>
      template.id === selectedTemplate.id ? { ...newTemplate, id: template.id } : template
    );

    setTemplates(updatedTemplates);
    setIsEditDialogOpen(false);
    resetNewTemplate();
    setImagePreview(null);
    toast("Template atualizado", {
      description: `${newTemplate.title} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;

    const updatedTemplates = templates.filter(
      (template) => template.id !== selectedTemplate.id
    );

    setTemplates(updatedTemplates);
    setIsDeleteDialogOpen(false);
    toast("Template removido", {
      description: `${selectedTemplate.title} foi removido com sucesso.`,
    });
  };

  const resetNewTemplate = () => {
    setNewTemplate({
      id: "",
      title: "",
      imageUrl: "/placeholder.svg",
      category: "",
      downloads: 0,
      status: "ativo",
      premium: false,
      canvaLink: "",
      isForFreePlan: false,
      isForUltimatePlan: true,
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const openEditDialog = (template: Template) => {
    setSelectedTemplate(template);
    setNewTemplate({ ...template });
    setImagePreview(template.imageUrl);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    {
      key: "title",
      title: "Nome",
      render: (value: string, template: Template) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded bg-gray-800 mr-3">
            <img
              src={template.imageUrl}
              alt={template.title}
              className="h-full w-full object-cover rounded"
            />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-400">{template.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: "downloads",
      title: "Downloads",
    },
    {
      key: "premium",
      title: "Tipo",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"} className={value ? "bg-amber-600 text-white hover:bg-amber-700" : "text-gray-300"}>
          {value ? "Premium" : "Grátis"}
        </Badge>
      ),
    },
    {
      key: "isForFreePlan",
      title: "Plano",
      render: (_: any, template: Template) => (
        <div className="space-y-1">
          <Badge variant={template.isForFreePlan ? "default" : "outline"} className="mr-1 bg-green-600">
            Grátis
          </Badge>
          <Badge variant={template.isForUltimatePlan ? "default" : "outline"} className="bg-purple-600">
            Ultimate
          </Badge>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => (
        <Badge variant={value === "ativo" ? "default" : "outline"} className={value === "ativo" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-gray-300"}>
          {value === "ativo" ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "canvaLink",
      title: "Canva",
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ea384c] hover:underline flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Link
        </a>
      ),
    },
    {
      key: "actions",
      title: "Ações",
      render: (_: any, template: Template) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(template)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteDialog(template)}
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
        <h2 className="text-2xl font-bold text-white">Templates</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <TableCard title="Templates" columns={columns} data={templates} />

      {/* Add/Edit Template Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (isAddDialogOpen) setIsAddDialogOpen(open);
          if (isEditDialogOpen) setIsEditDialogOpen(open);
          if (!open) {
            resetNewTemplate();
            setImagePreview(null);
          }
        }}
      >
        <DialogContent className="bg-[#222222] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Adicionar Novo Template" : "Editar Template"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os detalhes do template abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Nome do Template*</Label>
              <Input
                id="title"
                value={newTemplate.title}
                onChange={(e) => handleInputChange(e, "title")}
                className="bg-[#1A1F2C] border-gray-700"
              />
            </div>

            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="templateImage">Imagem de Capa* (9:16)</Label>
              <div className="flex flex-col items-center p-4 border border-dashed border-gray-700 rounded-md bg-[#1A1F2C]">
                {imagePreview ? (
                  <div className="relative w-32 h-56 mb-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded" 
                    />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-56 bg-gray-800 rounded flex items-center justify-center mb-2">
                    <Upload className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <Input
                  id="templateImage"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label 
                  htmlFor="templateImage" 
                  className="cursor-pointer bg-[#2A2F3C] px-3 py-1 rounded text-sm hover:bg-[#3A3F4C] transition-colors"
                >
                  {imagePreview ? "Trocar Imagem" : "Selecionar Imagem"}
                </Label>
                <p className="text-xs text-gray-400 mt-1">
                  Formatos: JPG, PNG, WEBP. Proporção: 9:16
                </p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria*</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value) => handleSelectChange(value, "category")}
              >
                <SelectTrigger className="bg-[#1A1F2C] border-gray-700">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="canvaLink">Link do Canva*</Label>
              <div className="flex items-center space-x-2">
                <Link className="h-4 w-4 text-gray-400" />
                <Input
                  id="canvaLink"
                  value={newTemplate.canvaLink}
                  onChange={(e) => handleInputChange(e, "canvaLink")}
                  className="bg-[#1A1F2C] border-gray-700"
                  placeholder="https://canva.com/design/..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTemplate.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger className="bg-[#1A1F2C] border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-gray-700">
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Disponibilidade por Plano</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isForFreePlan"
                  checked={newTemplate.isForFreePlan}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(!!checked, "isForFreePlan")
                  }
                />
                <Label htmlFor="isForFreePlan" className="text-sm">Disponível para Plano Grátis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isForUltimatePlan"
                  checked={newTemplate.isForUltimatePlan}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(!!checked, "isForUltimatePlan")
                  }
                />
                <Label htmlFor="isForUltimatePlan" className="text-sm">Disponível para Plano Ultimate</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPremium"
                checked={newTemplate.premium}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(!!checked, "premium")
                }
              />
              <Label htmlFor="isPremium">Template Premium</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (isAddDialogOpen) setIsAddDialogOpen(false);
                if (isEditDialogOpen) setIsEditDialogOpen(false);
                resetNewTemplate();
              }}
              className="border-gray-700 text-white hover:bg-[#1A1F2C] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={isAddDialogOpen ? handleAddTemplate : handleEditTemplate}
              className="bg-[#ea384c] hover:bg-[#ea384c]/80"
            >
              {isAddDialogOpen ? "Adicionar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#222222] text-white">
          <DialogHeader>
            <DialogTitle>Remover Template</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja remover este template?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTemplate && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded bg-gray-800 mr-3">
                  <img
                    src={selectedTemplate.imageUrl}
                    alt={selectedTemplate.title}
                    className="h-full w-full object-cover rounded"
                  />
                </div>
                <div>
                  <div className="font-medium">{selectedTemplate.title}</div>
                  <div className="text-xs text-gray-400">
                    {selectedTemplate.category} • {selectedTemplate.downloads} downloads
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-[#1A1F2C] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteTemplate}
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

export default AdminTemplates;
