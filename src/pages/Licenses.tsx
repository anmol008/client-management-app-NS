import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Loader2, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLicenses } from "@/context/LicensesContext";
import { useClients } from "@/context/ClientsContext";
import { useProducts } from "@/context/ProductsContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { License, CreateLicenseRequest, UpdateLicenseRequest, UpdatePlan } from "@/services/api";
import { format } from "date-fns";

const Licenses = () => {
  const {
    licenses,
    loading: licensesLoading,
    creating,
    updating,
    deleting,
    createLicense,
    updateLicense,
    deleteLicense,
    updatePlan
  } = useLicenses();

  const { clients } = useClients();
  const { products } = useProducts();
  const { subscriptions, getSubscriptionById } = useSubscriptions();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const [formData, setFormData] = useState<Omit<CreateLicenseRequest, 'client_comp_code'> & {
    client_comp_id?: number;
    client_comp_code: string;
    max_allowed_users: number;
    start_date: string;
    end_date: string;
  }>({
    client_comp_code: "",
    client_comp_id: undefined,
    subscription_id: 0,
    main_app_id: 0,
    max_allowed_users: 0,
    form_end_point: "",
    is_active: true,
    start_date: "",
    end_date: "",
  });

  const [isRenewing, setIsRenewing] = useState(false);

  const toggleRenew = () => {
    setIsRenewing((prev) => {
      const newRenewing = !prev;
      if (newRenewing && selectedLicense && formData.subscription_id > 0) {
        // When renewing, calculate dates from today
        const { start_date, end_date } = calculateDates(formData.subscription_id, true);
        setFormData(prev => ({
          ...prev,
          start_date,
          end_date
        }));
      } else if (!newRenewing && selectedLicense) {
        // When cancelling renew, restore original dates
        setFormData(prev => ({
          ...prev,
          start_date: selectedLicense.start_date,
          end_date: selectedLicense.end_date
        }));
      }
      return newRenewing;
    });
  };

  const filteredLicenses = licenses.filter(license =>
    license.client_comp_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get client name by code
  const getClientNameByCode = (code: string) => {
    const client = clients.find(c => c.client_comp_code === code);
    return client ? client.client_comp_name : code;
  };

  // Get product name by ID
  const getProductNameById = (id: number) => {
    const product = products.find(p => p.main_app_id === id);
    return product ? product.main_app_name : `Product ${id}`;
  };

  // Get Subscription Type by ID
  const getSubscriptionNameById = (id: number) => {
    const subscription = subscriptions.find(s => s.subscription_id === id);
    return subscription ? subscription.subscription_name : `Subscription ${id}`;
  };

  // Calculate dates based on subscription
  const calculateDates = (subscriptionId: number, fromToday: boolean = false) => {
    const subscription = subscriptions.find(s => s.subscription_id === subscriptionId);
    if (!subscription) return { start_date: "", end_date: "" };

    const startDate = fromToday ? new Date() : (selectedLicense ? new Date(selectedLicense.start_date) : new Date());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscription.duration_days);

    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };

  // Update max allowed users and dates when subscription changes
  useEffect(() => {
    if (formData.subscription_id > 0) {
      const subscription = getSubscriptionById(formData.subscription_id);
      if (subscription) {
        const { start_date, end_date } = calculateDates(formData.subscription_id, isRenewing);
        setFormData(prev => ({
          ...prev,
          max_allowed_users: subscription.max_allowed_users,
          start_date,
          end_date
        }));
      }
    }
  }, [formData.subscription_id, getSubscriptionById, isRenewing, subscriptions, selectedLicense]);

  const handleCreate = async () => {
    if (!formData.client_comp_code || formData.subscription_id === 0 || formData.main_app_id === 0) {
      return;
    }

    const licenseData: CreateLicenseRequest = {
      client_comp_code: formData.client_comp_code,
      subscription_id: formData.subscription_id,
      main_app_id: formData.main_app_id,
      form_end_point: formData.form_end_point,
      is_active: formData.is_active,
    };

    const success = await createLicense(licenseData);
    if (success) {
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleEdit = (license: License) => {
    setSelectedLicense(license);
    const client = clients.find(c => c.client_comp_code === license.client_comp_code);
    setFormData({
      client_comp_code: license.client_comp_code,
      client_comp_id: client?.client_comp_id,
      subscription_id: license.subscription_id,
      main_app_id: license.main_app_id,
      max_allowed_users: license.max_allowed_users,
      form_end_point: license.form_end_point,
      is_active: license.is_active,
      start_date: license.start_date,
      end_date: license.end_date,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedLicense || !formData.client_comp_code || formData.subscription_id === 0 || formData.main_app_id === 0) {
      return;
    }

    const licenseData: UpdateLicenseRequest = {
      client_subscription_id: selectedLicense.client_subscription_id,
      client_comp_code: formData.client_comp_code,
      subscription_id: formData.subscription_id,
      main_app_id: formData.main_app_id,
      max_allowed_users: formData.max_allowed_users,
      start_date: formData.start_date,
      end_date: formData.end_date,
      form_end_point: formData.form_end_point,
      is_active: formData.is_active,
    };

    const success = await updateLicense(licenseData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedLicense(null);
      setIsRenewing(false);
      resetForm();
    }
  };

  const handleDeleteClick = (license: License) => {
    setSelectedLicense(license);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedLicense) return;

    const success = await deleteLicense(selectedLicense.client_subscription_id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedLicense(null);
    }
  };

  const resetForm = () => {
    setFormData({
      client_comp_code: "",
      client_comp_id: undefined,
      subscription_id: 0,
      main_app_id: 0,
      max_allowed_users: 0,
      form_end_point: "",
      is_active: true,
      start_date: "",
      end_date: "",
    });
  };

  const handleUpdatePlan = async (license: License) => {
    const licenseData: UpdatePlan = {
      client_comp_code: license.client_comp_code,
      subscription_id: license.subscription_id,
      main_app_id: license.main_app_id,
      is_active: license.is_active,
    };
    await updatePlan(licenseData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Licenses</h1>
          <p className="text-muted-foreground">Manage client subscriptions and licenses</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add License
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search licenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {licensesLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>App Name</TableHead>
                  <TableHead>Users</TableHead>
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
                    <TableCell className="font-medium">{getClientNameByCode(license.client_comp_code)}</TableCell>
                    <TableCell>{getSubscriptionNameById(license.subscription_id)}</TableCell>
                    <TableCell>{getProductNameById(license.main_app_id)}</TableCell>
                    <TableCell>{license.max_allowed_users}</TableCell>
                    <TableCell>
                      {license.start_date ? format(new Date(license.start_date), "dd-MM-yyyy") : ""}
                    </TableCell>
                    <TableCell>
                      {license.end_date ? format(new Date(license.end_date), "dd-MM-yyyy") : ""}
                    </TableCell>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdatePlan(license)}
                          disabled={updating}
                        >
                          Update Plan
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New License</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_comp_name">Client Company Name</Label>
              <Select
                value={formData.client_comp_id?.toString() || ""}
                onValueChange={(value) => {
                  const clientId = parseInt(value);
                  const client = clients.find(c => c.client_comp_id === clientId);
                  if (client) {
                    setFormData({
                      ...formData,
                      client_comp_id: clientId,
                      client_comp_code: client.client_comp_code
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client company" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.client_comp_id} value={client.client_comp_id.toString()}>
                      {client.client_comp_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription_id">Subscription Type</Label>
              <Select
                value={formData.subscription_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, subscription_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((subscription) => (
                    <SelectItem key={subscription.subscription_id} value={subscription.subscription_id.toString()}>
                      {subscription.subscription_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_app_id">Main App Name</Label>
              <Select
                value={formData.main_app_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, main_app_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select main app" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.main_app_id} value={product.main_app_id.toString()}>
                      {product.main_app_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_allowed_users">Max Allowed Users</Label>
              <Input
                disabled
                id="max_allowed_users"
                type="number"
                value={formData.max_allowed_users}
                placeholder="Auto-filled from subscription"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                disabled
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                disabled
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="form_end_point">Form End Point</Label>
              <Input
                id="form_end_point"
                value={formData.form_end_point}
                onChange={(e) => setFormData({ ...formData, form_end_point: e.target.value })}
                placeholder="Enter form end point URL"
              />
            </div>

            {/* <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div> */}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create License
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit License</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_client_comp_name">Client Company Name</Label>
              <Select
                value={formData.client_comp_id?.toString() || ""}
                onValueChange={(value) => {
                  const clientId = parseInt(value);
                  const client = clients.find(c => c.client_comp_id === clientId);
                  if (client) {
                    setFormData({
                      ...formData,
                      client_comp_id: clientId,
                      client_comp_code: client.client_comp_code
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client company" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.client_comp_id} value={client.client_comp_id.toString()}>
                      {client.client_comp_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_subscription_id">Subscription Type</Label>
              <Select
                value={formData.subscription_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, subscription_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((subscription) => (
                    <SelectItem key={subscription.subscription_id} value={subscription.subscription_id.toString()}>
                      {subscription.subscription_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_main_app_id">Main App Name</Label>
              <Select
                value={formData.main_app_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, main_app_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select main app" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.main_app_id} value={product.main_app_id.toString()}>
                      {product.main_app_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_max_allowed_users">Max Allowed Users</Label>
              <Input
                disabled
                id="edit_max_allowed_users"
                type="number"
                value={formData.max_allowed_users}
                placeholder="Auto-filled from subscription"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit_form_end_point">Form End Point</Label>
              <Input
                id="edit_form_end_point"
                value={formData.form_end_point}
                onChange={(e) => setFormData({ ...formData, form_end_point: e.target.value })}
                placeholder="Enter form end point URL"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="edit_start_date">Start Date</Label>
              <Input
                id="edit_start_date"
                type="date"
                value={formData.start_date}
                disabled
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="edit_end_date">End Date</Label>
              <Input
                id="edit_end_date"
                type="date"
                value={formData.end_date}
                disabled
              />
            </div>

            {/* <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div> */}
          </div>
          <div className="flex justify-between items-center mt-4">
            {/* Renew button on the left */}
            <Button
              onClick={toggleRenew}
              variant="ghost"
              className={`flex items-center space-x-2 rounded-full px-4 py-2 ${isRenewing
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
            >
              {isRenewing ? (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  <span>Renew</span>
                </>
              )}
            </Button>

            {/* Cancel and Update buttons on the right */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update License
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the license for "{selectedLicense && getClientNameByCode(selectedLicense.client_comp_code)}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Licenses;