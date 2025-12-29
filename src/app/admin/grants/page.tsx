import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import GrantSubscriptionDetails, { type GrantSubscriptionRow } from "./GrantSubscriptionDetails";

export const dynamic = "force-dynamic";

async function getGrantSubscriptions(): Promise<GrantSubscriptionRow[]> {
  const { data, error } = await supabaseAdmin
    .from("grant_subscriptions")
    .select("id,name,email,plan,locale,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load grant subscriptions from Supabase:", error);
    return [];
  }
  if (!data) return [];

  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    plan: row.plan,
    locale: row.locale ?? "ng",
    createdAt: row.created_at || new Date().toISOString(),
  }));
}

export default async function AdminGrantRequestsPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const subscriptions = await getGrantSubscriptions();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold font-headline">Grant Requests</h1>
            <p className="text-muted-foreground">Review grant access subscriptions and follow up.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Grant Requests</CardTitle>
          <CardDescription>A list of all grant access subscriptions submitted through the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Plan</TableHead>
                <TableHead className="hidden lg:table-cell">Locale</TableHead>
                <TableHead className="hidden md:table-cell">Submitted At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                      {item.email}
                    </a>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell capitalize">{item.plan}</TableCell>
                  <TableCell className="hidden lg:table-cell uppercase">{item.locale}</TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(item.createdAt), "PPpp")}</TableCell>
                  <TableCell>
                    <GrantSubscriptionDetails subscription={item} />
                  </TableCell>
                </TableRow>
              ))}
              {subscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center p-8 text-muted-foreground">
                    No grant requests yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

