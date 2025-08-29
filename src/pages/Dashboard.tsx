import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, CreditCard, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Clients",
    value: "156",
    change: "+12 from last month",
    icon: Users,
    trend: "up"
  },
  {
    title: "Active Products",
    value: "4",
    change: "DataGPT, Testament, Checkmate, HRMS",
    icon: Package,
    trend: "stable"
  },
  {
    title: "Active Licenses",
    value: "298",
    change: "+23 from last month",
    icon: CreditCard,
    trend: "up"
  },
  {
    title: "Revenue Growth",
    value: "+15.2%",
    change: "Compared to last quarter",
    icon: TrendingUp,
    trend: "up"
  }
];

const recentClients = [
  { name: "TechCorp Solutions", product: "DataGPT", plan: "Professional", status: "Active", expiry: "2024-12-15" },
  { name: "Global Industries", product: "HRMS", plan: "Basic", status: "Active", expiry: "2024-11-30" },
  { name: "StartupXYZ", product: "Testament", plan: "Demo", status: "Trial", expiry: "2024-09-15" },
  { name: "Enterprise Ltd", product: "Checkmate", plan: "Professional", status: "Active", expiry: "2025-01-20" },
  { name: "Business Inc", product: "DataGPT", plan: "Basic", status: "Expired", expiry: "2024-08-10" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "success";
    case "Trial": return "warning";
    case "Expired": return "destructive";
    default: return "secondary";
  }
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to CPS Client Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Client Activity</CardTitle>
          <CardDescription>
            Latest client licenses and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.product} • {client.plan} Plan
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">Expires: {client.expiry}</p>
                  </div>
                  <Badge variant={getStatusColor(client.status) as any}>
                    {client.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}