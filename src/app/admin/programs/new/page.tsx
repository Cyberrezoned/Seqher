import ProgramForm from "../ProgramForm";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewProgramPage() {
    const admin = await requireAdmin();
    if (!admin) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Create New Program</h1>
                <p className="text-muted-foreground">Fill in the details below to create a new program.</p>
            </div>
            <ProgramForm />
        </div>
    )
}
