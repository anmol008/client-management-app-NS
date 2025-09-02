import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subscriptionApi, Subscription } from "@/services/api";

const Subscriptions = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

  const [formData, setFormData] = useState({
    subscription_name: "",
    subscription_price: "",
    duration_days: 0,
    max_allowed_users: 0,
    is_active: true,
  });

  // Load subscriptions
  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionApi.getAll();
      setSubscriptions(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load subscriptions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.subscription_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      subscription_name: "",
      subscription_price: "",
      duration_days: 0,
      max_allowed_users: 0,
      is_active: true,
    });
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      const newSub = await subscriptionApi.create({
        ...formData,
        subscription_price: Number(formData.subscription_price),
        duration_days: Number(formData.duration_days),
        max_allowed_users: Number(formData.max_allowed_users),
      });
      setSubscriptions([...subscriptions, newSub]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Subscription Created",
        description: "New subscription has been created successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setFormData({
      subscription_name: sub.subscription_name,
      subscription_price: String(sub.subscription_price),
      duration_days: sub.duration_days,
      max_allowed_users: sub.max_allowed_users,
      is_active: sub.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedSubscription) return;

    try {
      setUpdating(true);
      await subscriptionApi.update({
        subscription_id: selectedSubscription.subscription_id,
        ...formData,
        subscription_price: Number(formData.subscription_price),
        duration_days: Number(formData.duration_days),
        max_allowed_users: Number(formData.max_allowed_users),
      });

      const updatedSubs = subscriptions.map((sub) =>
        sub.subscription_id === selectedSubscription.subscription_id
          ? {
              ...sub,
              ...formData,
              subscription_price: Number(formData.subscription_price),
            }
          : sub
      );
      setSubscriptions(updatedSubs);
      setIsEditDialogOpen(false);
      setSelectedSubscription(null);
      resetForm();
      toast({
        title: "Subscription Updated",
        description: "Subscription has been updated successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (sub: Subscription) => {
    setSubscriptionToDelete(sub);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!subscriptionToDelete) return;

    try {
      setDeleting(true);
      await subscriptionApi.delete({
        subscription_id: subscriptionToDelete.subscription_id,
        is_active: false,
      });

      setSubscriptions(
        subscriptions.filter((sub) => sub.subscription_id !== subscriptionToDelete.subscription_id)
      );
      setIsDeleteDialogOpen(false);
      setSubscriptionToDelete(null);
      toast({
        title: "Subscription Deleted",
        description: "Subscription has been deleted successfully.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your subscription plans</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Subscription List */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription List</CardTitle>
          <CardDescription>View and manage all subscription plans</CardDescription>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration (days)</TableHead>
                  <TableHead>Max Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.subscription_id}>
                    <TableCell className="font-medium">{sub.subscription_name}</TableCell>
                    <TableCell>${sub.subscription_price}</TableCell>
                    <TableCell>{sub.duration_days}</TableCell>
                    <TableCell>{sub.max_allowed_users}</TableCell>
                    <TableCell>
                      <Badge variant={sub.is_active ? "default" : "secondary"}>
                        {sub.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(sub)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(sub)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Subscription</DialogTitle>
            <DialogDescription>Add a new subscription plan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formData.subscription_name}
                onChange={(e) => setFormData({ ...formData, subscription_name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Platinum"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.subscription_price}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscription_price: e.target.value,
                  })
                }
                className="col-span-3 no-arrows"
                placeholder="e.g., 25000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                className="col-span-3"
                placeholder="e.g., 30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxUsers" className="text-right">Max Users</Label>
              <Input
                id="maxUsers"
                type="number"
                value={formData.max_allowed_users}
                onChange={(e) => setFormData({ ...formData, max_allowed_users: Number(e.target.value) })}
                className="col-span-3"
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">Active</Label>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>Update subscription information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">Name</Label>
              <Input
                id="editName"
                value={formData.subscription_name}
                onChange={(e) => setFormData({ ...formData, subscription_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editPrice" className="text-right">Price</Label>
              <Input
                id="editPrice"
                type="number"
                value={formData.subscription_price}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setFormData({ ...formData, subscription_price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDuration" className="text-right">Duration</Label>
              <Input
                id="editDuration"
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editMaxUsers" className="text-right">Max Users</Label>
              <Input
                id="editMaxUsers"
                type="number"
                value={formData.max_allowed_users}
                onChange={(e) => setFormData({ ...formData, max_allowed_users: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editActive" className="text-right">Active</Label>
              <Switch
                id="editActive"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subscription "{subscriptionToDelete?.subscription_name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subscriptions;