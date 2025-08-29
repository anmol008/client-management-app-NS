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

interface Subscription {
  subscription_id: string;
  subscription_name: string;
  subscription_price: number;
  duration_days: number;
  max_allowed_users: number;
  is_active: boolean;
}

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      subscription_id: "SUB001",
      subscription_name: "Basic Plan",
      subscription_price: 99.99,
      duration_days: 365,
      max_allowed_users: 10,
      is_active: true,
    },
    {
      subscription_id: "SUB002",
      subscription_name: "Premium Plan",
      subscription_price: 199.99,
      duration_days: 365,
      max_allowed_users: 50,
      is_active: true,
    },
    {
      subscription_id: "SUB003",
      subscription_name: "Enterprise Plan",
      subscription_price: 499.99,
      duration_days: 365,
      max_allowed_users: 100,
      is_active: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<Subscription>({
    subscription_id: "",
    subscription_name: "",
    subscription_price: 0,
    duration_days: 0,
    max_allowed_users: 0,
    is_active: true,
  });

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.subscription_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.subscription_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSubscriptions([...subscriptions, formData]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({ ...subscription });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedSubscription) {
      const updatedSubscriptions = subscriptions.map(subscription =>
        subscription.subscription_id === selectedSubscription.subscription_id
          ? formData
          : subscription
      );
      setSubscriptions(updatedSubscriptions);
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedSubscription(null);
    }
  };

  const handleDeleteClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedSubscription) {
      setSubscriptions(subscriptions.filter(subscription => subscription.subscription_id !== selectedSubscription.subscription_id));
      setIsDeleteDialogOpen(false);
      setSelectedSubscription(null);
    }
  };

  const resetForm = () => {
    setFormData({
      subscription_id: "",
      subscription_name: "",
      subscription_price: 0,
      duration_days: 0,
      max_allowed_users: 0,
      is_active: true,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label htmlFor="subscription_name">Subscription Name</Label>
                <Input
                  id="subscription_name"
                  value={formData.subscription_name}
                  onChange={(e) => setFormData({ ...formData, subscription_name: e.target.value })}
                  placeholder="Enter subscription name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription_price">Price</Label>
                <Input
                  id="subscription_price"
                  type="number"
                  step="0.01"
                  value={formData.subscription_price}
                  onChange={(e) => setFormData({ ...formData, subscription_price: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_days">Duration (Days)</Label>
                <Input
                  id="duration_days"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 0 })}
                  placeholder="Enter duration in days"
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
              <div className="flex items-center space-x-2">
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
              <Button onClick={handleCreate}>Create Subscription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subscriptions..."
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
              <TableHead>Subscription ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration (Days)</TableHead>
              <TableHead>Max Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.subscription_id}>
                <TableCell className="font-medium">{subscription.subscription_id}</TableCell>
                <TableCell>{subscription.subscription_name}</TableCell>
                <TableCell>${subscription.subscription_price.toFixed(2)}</TableCell>
                <TableCell>{subscription.duration_days}</TableCell>
                <TableCell>{subscription.max_allowed_users}</TableCell>
                <TableCell>
                  <Badge variant={subscription.is_active ? "default" : "secondary"}>
                    {subscription.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subscription)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(subscription)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_subscription_id">Subscription ID</Label>
              <Input
                id="edit_subscription_id"
                value={formData.subscription_id}
                onChange={(e) => setFormData({ ...formData, subscription_id: e.target.value })}
                placeholder="Enter subscription ID"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_subscription_name">Subscription Name</Label>
              <Input
                id="edit_subscription_name"
                value={formData.subscription_name}
                onChange={(e) => setFormData({ ...formData, subscription_name: e.target.value })}
                placeholder="Enter subscription name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_subscription_price">Price</Label>
              <Input
                id="edit_subscription_price"
                type="number"
                step="0.01"
                value={formData.subscription_price}
                onChange={(e) => setFormData({ ...formData, subscription_price: parseFloat(e.target.value) || 0 })}
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_duration_days">Duration (Days)</Label>
              <Input
                id="edit_duration_days"
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 0 })}
                placeholder="Enter duration in days"
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
            <div className="flex items-center space-x-2">
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
            <Button onClick={handleUpdate}>Update Subscription</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subscription
              "{selectedSubscription?.subscription_name}" and remove all its data.
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

export default Subscriptions;