import { notFound } from 'next/navigation';
import ProgramForm from "../../ProgramForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Program } from '@/lib/types';


type Props = {
    params: { id: string }
}

async function getProgram(id: string): Promise<Program | null> {
    const { data, error } = await supabaseAdmin
        .from('programs')
        .select('id,title,summary,description,image_id,sdg_goals,locale')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Failed to load program from Supabase:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        summary: data.summary,
        description: data.description,
        imageId: data.image_id,
        sdgGoals: data.sdg_goals || [],
        locale: (data.locale as Program['locale']) || 'ng',
    };
}

export default async function EditProgramPage({ params }: Props) {
    const program = await getProgram(params.id);
    if (!program) {
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
