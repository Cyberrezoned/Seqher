import AnnouncementForm from "../AnnouncementForm";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewAnnouncementPage() {
    const admin = await requireAdmin();
    if (!admin) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Create New Announcement</h1>
                <p className="text-muted-foreground">Fill in the details below to create a new announcement.</p>
            </div>
            <AnnouncementForm />
        </div>
    )
}
