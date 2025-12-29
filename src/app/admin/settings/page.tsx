import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Settings</h1>
          <p className="text-muted-foreground">Admin access and environment configuration.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Admins are determined by Supabase `app_metadata.role`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            To grant admin access, set the user’s <code className="text-foreground">app_metadata.role</code> to{" "}
            <code className="text-foreground">admin</code> in Supabase Auth.
          </p>
          <p>
            This dashboard uses server-side checks for admin-only actions (create/edit/delete content, manage submissions).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

