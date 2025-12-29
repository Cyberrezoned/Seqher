import NewsForm from "../NewsForm";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewNewsArticlePage() {
    const admin = await requireAdmin();
    if (!admin) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Create New News Post</h1>
                <p className="text-muted-foreground">Fill in the details below to publish a new news post.</p>
            </div>
            <NewsForm />
        </div>
    )
}
