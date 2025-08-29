import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  main_app_id: number;
  main_app_name: string;
  main_app_version: string;
  main_app_code: string;
  main_app_model_no: string;
  main_app_desc: string;
  is_active: boolean;
}

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      main_app_id: 1,
      main_app_name: "DataGPT",
      main_app_version: "2.1.0",
      main_app_code: "DGPT",
      main_app_model_no: "DGPT-001",
      main_app_desc: "AI-powered data analysis and insights platform",
      is_active: true,
    },
    {
      main_app_id: 2,
      main_app_name: "Testament",
      main_app_version: "1.5.2",
      main_app_code: "TEST",
      main_app_model_no: "TEST-002",
      main_app_desc: "Document management and testing framework",
      is_active: true,
    },
    {
      main_app_id: 3,
      main_app_name: "CheckMate",
      main_app_version: "3.0.1",
      main_app_code: "CHKM",
      main_app_model_no: "CHKM-003",
      main_app_desc: "Quality assurance and validation system",
      is_active: true,
    },
    {
      main_app_id: 4,
      main_app_name: "HRMS",
      main_app_version: "4.2.0",
      main_app_code: "HRMS",
      main_app_model_no: "HRMS-004",
      main_app_desc: "Human Resource Management System",
      is_active: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    main_app_name: "",
    main_app_version: "",
    main_app_code: "",
    main_app_model_no: "",
    main_app_desc: "",
    is_active: true,
  });

  const filteredProducts = products.filter(product =>
    product.main_app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.main_app_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.main_app_model_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      main_app_name: "",
      main_app_version: "",
      main_app_code: "",
      main_app_model_no: "",
      main_app_desc: "",
      is_active: true,
    });
  };

  const handleCreate = () => {
    const newProduct: Product = {
      main_app_id: Math.max(...products.map(p => p.main_app_id)) + 1,
      ...formData,
    };
    setProducts([...products, newProduct]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "Product Created",
      description: "New product has been created successfully.",
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      main_app_name: product.main_app_name,
      main_app_version: product.main_app_version,
      main_app_code: product.main_app_code,
      main_app_model_no: product.main_app_model_no,
      main_app_desc: product.main_app_desc,
      is_active: product.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedProduct) return;
    
    const updatedProducts = products.map(product =>
      product.main_app_id === selectedProduct.main_app_id
        ? { ...product, ...formData }
        : product
    );
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    resetForm();
    toast({
      title: "Product Updated",
      description: "Product has been updated successfully.",
    });
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    
    const updatedProducts = products.filter(product => product.main_app_id !== productToDelete.main_app_id);
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
    toast({
      title: "Product Deleted",
      description: "Product has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your software products</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>View and manage all software products</CardDescription>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Model No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.main_app_id}>
                  <TableCell className="font-medium">{product.main_app_name}</TableCell>
                  <TableCell>{product.main_app_code}</TableCell>
                  <TableCell>{product.main_app_version}</TableCell>
                  <TableCell>{product.main_app_model_no}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new software product to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Product Name
              </Label>
              <Input
                id="name"
                value={formData.main_app_name}
                onChange={(e) => setFormData({ ...formData, main_app_name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., DataGPT"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={formData.main_app_code}
                onChange={(e) => setFormData({ ...formData, main_app_code: e.target.value })}
                className="col-span-3"
                placeholder="e.g., DGPT"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="version" className="text-right">
                Version
              </Label>
              <Input
                id="version"
                value={formData.main_app_version}
                onChange={(e) => setFormData({ ...formData, main_app_version: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modelNo" className="text-right">
                Model No
              </Label>
              <Input
                id="modelNo"
                value={formData.main_app_model_no}
                onChange={(e) => setFormData({ ...formData, main_app_model_no: e.target.value })}
                className="col-span-3"
                placeholder="e.g., DGPT-001"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="desc" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="desc"
                value={formData.main_app_desc}
                onChange={(e) => setFormData({ ...formData, main_app_desc: e.target.value })}
                className="col-span-3"
                placeholder="Product description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">
                Product Name
              </Label>
              <Input
                id="editName"
                value={formData.main_app_name}
                onChange={(e) => setFormData({ ...formData, main_app_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCode" className="text-right">
                Code
              </Label>
              <Input
                id="editCode"
                value={formData.main_app_code}
                onChange={(e) => setFormData({ ...formData, main_app_code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editVersion" className="text-right">
                Version
              </Label>
              <Input
                id="editVersion"
                value={formData.main_app_version}
                onChange={(e) => setFormData({ ...formData, main_app_version: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editModelNo" className="text-right">
                Model No
              </Label>
              <Input
                id="editModelNo"
                value={formData.main_app_model_no}
                onChange={(e) => setFormData({ ...formData, main_app_model_no: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="editDesc" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="editDesc"
                value={formData.main_app_desc}
                onChange={(e) => setFormData({ ...formData, main_app_desc: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editActive" className="text-right">
                Active
              </Label>
              <Switch
                id="editActive"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.main_app_name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;