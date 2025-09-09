import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, CreditCard, TrendingUp } from "lucide-react";
import { useClients } from "@/context/ClientsContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { useProducts } from "@/context/ProductsContext";
import { useLicenses } from "@/context/LicensesContext";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";


const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "success";
    case "Trial": return "warning";
    case "Expired": return "destructive";
    default: return "secondary";
  }
};

export default function Dashboard() {
  const { clients } = useClients();
  const { products } = useProducts();
  const { subscriptions } = useSubscriptions();
  const { licenses } = useLicenses();

  const navigate = useNavigate();

  // Calculate stats from real data
  const stats = useMemo(() => {
    const activeClients = clients.filter(client => client.is_active);
    const activeProducts = products.filter(product => product.is_active);
    const activeLicenses = licenses.filter(license => license.is_active);
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.is_active ? sub.subscription_price : 0), 0);

    return [
      {
        title: "Total Clients",
        value: activeClients.length.toString(),
        change: `${activeClients.length} active companies`,
        icon: Users,
        trend: "up",
        url: "/clients"
      },
      {
        title: "Active Products",
        value: activeProducts.length.toString(),
        change: activeProducts.map(p => p.main_app_name).join(", "),
        icon: Package,
        trend: "stable",
        url: "/products"
      },
      {
        title: "Active Licenses",
        value: activeLicenses.length.toString(),
        change: `${activeLicenses.length} total subscriptions`,
        icon: CreditCard,
        trend: "up",
        url: "/licenses"
      },
      {
        title: "Monthly Revenue",
        value: `$3225`,
        change: "Based on active subscriptions",
        icon: TrendingUp,
        trend: "up"
      }
    ];
  }, [clients, products, licenses, subscriptions]);

  // Get recent client licenses with enriched data
  const recentClientLicenses = useMemo(() => {
    return licenses.slice(0, 5).map(license => {
      const client = clients.find(c => c.client_comp_code === license.client_comp_code);
      const product = products.find(p => p.main_app_id === license.main_app_id);
      const subscription = subscriptions.find(s => s.subscription_id === license.subscription_id);

      return {
        name: client?.client_comp_name || 'Unknown Client',
        product: product?.main_app_name || 'Unknown Product',
        plan: subscription?.subscription_name || 'Unknown Plan',
        status: license.is_active ? 'Active' : 'Inactive',
        expiry: license.end_date || 'N/A',
        maxUsers: license.max_allowed_users
      };
    });
  }, [licenses, clients, products, subscriptions]);

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to NuSummit's Client Management Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="cursor-pointer grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card onClick={() => stat.url && navigate(stat.url)} key={stat.title} className="hover:scale-105 relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground line-clamp-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Client Licenses */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold">Recent Client Licenses</CardTitle>
          <CardDescription className="text-base">
            Latest client subscriptions and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClientLicenses.length > 0 ? recentClientLicenses.map((license, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{license.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {license.product} • {license.plan} • Max Users: {license.maxUsers}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Expires: {license.expiry}</p>
                  </div>
                  <Badge variant={getStatusColor(license.status) as any} className="font-semibold">
                    {license.status}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No client licenses found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}