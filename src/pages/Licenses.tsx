import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface License {
  client_subscription_id: number;
  client_comp_code: string;
  subscription_id: string;
  main_app_id: string;
  max_allowed_users: number;
  start_date: string;
  end_date: string;
  form_12a_no: string;
  form_80g_no: string;
  form_end_point: string;
  is_active: boolean;
}

const Licenses = () => {
  const [licenses, setLicenses] = useState<License[]>([
    {
      client_subscription_id: 1,
      client_comp_code: "CLI001",
      subscription_id: "SUB001",
      main_app_id: "APP001",
      max_allowed_users: 50,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      form_12a_no: "12A001",
      form_80g_no: "80G001",
      form_end_point: "/api/v1/endpoint1",
      is_active: true,
    },
    {
      client_subscription_id: 2,
      client_comp_code: "CLI002",
      subscription_id: "SUB002",
      main_app_id: "APP002",
      max_allowed_users: 25,
      start_date: "2024-02-01",
      end_date: "2025-01-31",
      form_12a_no: "12A002",
      form_80g_no: "80G002",
      form_end_point: "/api/v1/endpoint2",
      is_active: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [formData, setFormData] = useState<Omit<License, 'client_subscription_id'>>({
    client_comp_code: "",
    subscription_id: "",
    main_app_id: "",
    max_allowed_users: 0,
    start_date: "",
    end_date: "",
    form_12a_no: "",
    form_80g_no: "",
    form_end_point: "",
    is_active: true,
  });

  const filteredLicenses = licenses.filter(license =>
    license.client_comp_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.subscription_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.main_app_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newLicense: License = {
      client_subscription_id: Math.max(...licenses.map(l => l.client_subscription_id)) + 1,
      ...formData,
    };
    setLicenses([...licenses, newLicense]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (license: License) => {
    setSelectedLicense(license);
    setFormData({
      client_comp_code: license.client_comp_code,
      subscription_id: license.subscription_id,
      main_app_id: license.main_app_id,
      max_allowed_users: license.max_allowed_users,
      start_date: license.start_date,
      end_date: license.end_date,
      form_12a_no: license.form_12a_no,
      form_80g_no: license.form_80g_no,
      form_end_point: license.form_end_point,
      is_active: license.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedLicense) {
      const updatedLicenses = licenses.map(license =>
        license.client_subscription_id === selectedLicense.client_subscription_id
          ? { ...selectedLicense, ...formData }
          : license
      );
      setLicenses(updatedLicenses);
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedLicense(null);
    }
  };

  const handleDeleteClick = (license: License) => {
    setSelectedLicense(license);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedLicense) {
      setLicenses(licenses.filter(license => license.client_subscription_id !== selectedLicense.client_subscription_id));
      setIsDeleteDialogOpen(false);
      setSelectedLicense(null);
    }
  };

  const resetForm = () => {
    setFormData({
      client_comp_code: "",
      subscription_id: "",
      main_app_id: "",
      max_allowed_users: 0,
      start_date: "",
      end_date: "",
      form_12a_no: "",
      form_80g_no: "",
      form_end_point: "",
      is_active: true,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Licenses</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add License
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New License</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_comp_code">Client Company Code</Label>
                <Input
                  id="client_comp_code"
                  value={formData.client_comp_code}
                  onChange={(e) => setFormData({ ...formData, client_comp_code: e.target.value })}
                  placeholder="Enter client company code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription_id">Subscription ID</Label>
                <Input
                  id="subscription_id"
                  value={formData.subscription_id}
                  onChange={(e) => setFormData({ ...formData, subscription_id: e.target.value })}
                  placeholder="Enter subscription ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="main_app_id">Main App ID</Label>
                <Input
                  id="main_app_id"
                  value={formData.main_app_id}
                  onChange={(e) => setFormData({ ...formData, main_app_id: e.target.value })}
                  placeholder="Enter main app ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_allowed_users">Max Allowed Users</Label>
                <Input
                  id="max_allowed_users"
                  type="number"
                  value={formData.max_allowed_users}
                  onChange={(e) => setFormData({ ...formData, max_allowed_users: parseInt(e.target.value) || 0 })}
                  placeholder="Enter max allowed users"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form_12a_no">Form 12A No</Label>
                <Input
                  id="form_12a_no"
                  value={formData.form_12a_no}
                  onChange={(e) => setFormData({ ...formData, form_12a_no: e.target.value })}
                  placeholder="Enter form 12A number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form_80g_no">Form 80G No</Label>
                <Input
                  id="form_80g_no"
                  value={formData.form_80g_no}
                  onChange={(e) => setFormData({ ...formData, form_80g_no: e.target.value })}
                  placeholder="Enter form 80G number"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="form_end_point">Form End Point</Label>
                <Input
                  id="form_end_point"
                  value={formData.form_end_point}
                  onChange={(e) => setFormData({ ...formData, form_end_point: e.target.value })}
                  placeholder="Enter form end point"
                />
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create License</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search licenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client Code</TableHead>
              <TableHead>Subscription ID</TableHead>
              <TableHead>App ID</TableHead>
              <TableHead>Max Users</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLicenses.map((license) => (
              <TableRow key={license.client_subscription_id}>
                <TableCell>{license.client_subscription_id}</TableCell>
                <TableCell className="font-medium">{license.client_comp_code}</TableCell>
                <TableCell>{license.subscription_id}</TableCell>
                <TableCell>{license.main_app_id}</TableCell>
                <TableCell>{license.max_allowed_users}</TableCell>
                <TableCell>{license.start_date}</TableCell>
                <TableCell>{license.end_date}</TableCell>
                <TableCell>
                  <Badge variant={license.is_active ? "default" : "secondary"}>
                    {license.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(license)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(license)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit License</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_client_comp_code">Client Company Code</Label>
              <Input
                id="edit_client_comp_code"
                value={formData.client_comp_code}
                onChange={(e) => setFormData({ ...formData, client_comp_code: e.target.value })}
                placeholder="Enter client company code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_subscription_id">Subscription ID</Label>
              <Input
                id="edit_subscription_id"
                value={formData.subscription_id}
                onChange={(e) => setFormData({ ...formData, subscription_id: e.target.value })}
                placeholder="Enter subscription ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_main_app_id">Main App ID</Label>
              <Input
                id="edit_main_app_id"
                value={formData.main_app_id}
                onChange={(e) => setFormData({ ...formData, main_app_id: e.target.value })}
                placeholder="Enter main app ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_max_allowed_users">Max Allowed Users</Label>
              <Input
                id="edit_max_allowed_users"
                type="number"
                value={formData.max_allowed_users}
                onChange={(e) => setFormData({ ...formData, max_allowed_users: parseInt(e.target.value) || 0 })}
                placeholder="Enter max allowed users"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_start_date">Start Date</Label>
              <Input
                id="edit_start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_end_date">End Date</Label>
              <Input
                id="edit_end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_form_12a_no">Form 12A No</Label>
              <Input
                id="edit_form_12a_no"
                value={formData.form_12a_no}
                onChange={(e) => setFormData({ ...formData, form_12a_no: e.target.value })}
                placeholder="Enter form 12A number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_form_80g_no">Form 80G No</Label>
              <Input
                id="edit_form_80g_no"
                value={formData.form_80g_no}
                onChange={(e) => setFormData({ ...formData, form_80g_no: e.target.value })}
                placeholder="Enter form 80G number"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit_form_end_point">Form End Point</Label>
              <Input
                id="edit_form_end_point"
                value={formData.form_end_point}
                onChange={(e) => setFormData({ ...formData, form_end_point: e.target.value })}
                placeholder="Enter form end point"
              />
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update License</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the license
              "{selectedLicense?.client_comp_code}" and remove all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Licenses;