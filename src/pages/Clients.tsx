import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  client_comp_id: number;
  client_comp_code: string;
  client_comp_name: string;
  client_comp_short_name: string;
  is_active: boolean;
}

const Clients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([
    {
      client_comp_id: 1,
      client_comp_code: "CL001",
      client_comp_name: "Tech Solutions Inc",
      client_comp_short_name: "TechSol",
      is_active: true,
    },
    {
      client_comp_id: 2,
      client_comp_code: "CL002",
      client_comp_name: "Digital Innovations Ltd",
      client_comp_short_name: "DigInno",
      is_active: true,
    },
    {
      client_comp_id: 3,
      client_comp_code: "CL003",
      client_comp_name: "Future Systems Corp",
      client_comp_short_name: "FutureSys",
      is_active: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    client_comp_code: "",
    client_comp_name: "",
    client_comp_short_name: "",
    is_active: true,
  });

  const filteredClients = clients.filter(client =>
    client.client_comp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_comp_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_comp_short_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      client_comp_code: "",
      client_comp_name: "",
      client_comp_short_name: "",
      is_active: true,
    });
  };

  const handleCreate = () => {
    const newClient: Client = {
      client_comp_id: Math.max(...clients.map(c => c.client_comp_id)) + 1,
      ...formData,
    };
    setClients([...clients, newClient]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "Client Created",
      description: "New client has been created successfully.",
    });
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      client_comp_code: client.client_comp_code,
      client_comp_name: client.client_comp_name,
      client_comp_short_name: client.client_comp_short_name,
      is_active: client.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedClient) return;
    
    const updatedClients = clients.map(client =>
      client.client_comp_id === selectedClient.client_comp_id
        ? { ...client, ...formData }
        : client
    );
    setClients(updatedClients);
    setIsEditDialogOpen(false);
    setSelectedClient(null);
    resetForm();
    toast({
      title: "Client Updated",
      description: "Client has been updated successfully.",
    });
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!clientToDelete) return;
    
    const updatedClients = clients.filter(client => client.client_comp_id !== clientToDelete.client_comp_id);
    setClients(updatedClients);
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
    toast({
      title: "Client Deleted",
      description: "Client has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage your client companies</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>View and manage all client companies</CardDescription>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients..."
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
                <TableHead>Code</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Short Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.client_comp_id}>
                  <TableCell className="font-medium">{client.client_comp_code}</TableCell>
                  <TableCell>{client.client_comp_name}</TableCell>
                  <TableCell>{client.client_comp_short_name}</TableCell>
                  <TableCell>
                    <Badge variant={client.is_active ? "default" : "secondary"}>
                      {client.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(client)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
            <DialogDescription>
              Add a new client company to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={formData.client_comp_code}
                onChange={(e) => setFormData({ ...formData, client_comp_code: e.target.value })}
                className="col-span-3"
                placeholder="e.g., CL001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Company Name
              </Label>
              <Input
                id="name"
                value={formData.client_comp_name}
                onChange={(e) => setFormData({ ...formData, client_comp_name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Tech Solutions Inc"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortName" className="text-right">
                Short Name
              </Label>
              <Input
                id="shortName"
                value={formData.client_comp_short_name}
                onChange={(e) => setFormData({ ...formData, client_comp_short_name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., TechSol"
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
            <Button onClick={handleCreate}>Create Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client company information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCode" className="text-right">
                Code
              </Label>
              <Input
                id="editCode"
                value={formData.client_comp_code}
                onChange={(e) => setFormData({ ...formData, client_comp_code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">
                Company Name
              </Label>
              <Input
                id="editName"
                value={formData.client_comp_name}
                onChange={(e) => setFormData({ ...formData, client_comp_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editShortName" className="text-right">
                Short Name
              </Label>
              <Input
                id="editShortName"
                value={formData.client_comp_short_name}
                onChange={(e) => setFormData({ ...formData, client_comp_short_name: e.target.value })}
                className="col-span-3"
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
            <Button onClick={handleUpdate}>Update Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client "{clientToDelete?.client_comp_name}". 
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

export default Clients;