import { notFound } from 'next/navigation';
import ProgramForm from "../../ProgramForm";
import { dbAdmin } from '@/lib/firebase-admin';
import type { Program } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getProgram(id: string): Promise<Program | null> {
    if (!dbAdmin) {
        return null;
    }
    const docRef = dbAdmin.collection('programs').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
        } as Program;
    }
    return null;
}

export default async function EditProgramPage({ params }: Props) {
    const program = await getProgram(params.id);
    if (!program) {
        if (!dbAdmin) {
            return (
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Edit Program</h1>
                        <p className="text-muted-foreground">Make changes to the program below.</p>
                    </div>
                    <div className="text-center p-8 text-destructive">
                        Firebase Admin is not configured. Unable to edit program.
                    </div>
                </div>
            )
        }
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit Program</h1>
                <p className="text-muted-foreground">Make changes to the program below.</p>
            </div>
            <ProgramForm program={program} />
        </div>
    )
}
