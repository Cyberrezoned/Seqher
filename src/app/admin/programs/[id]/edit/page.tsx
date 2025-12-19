import { notFound } from 'next/navigation';
import ProgramForm from "../../ProgramForm";
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Program } from '@/lib/types';


type Props = {
    params: Promise<{ id: string }>
}

async function getProgram(id: string): Promise<Program | null> {
    const primary = await supabaseAdmin
        .from('programs')
        .select('id,title,summary,description,image_id,sdg_goals,locale')
        .eq('id', id)
        .single();

    const fallback = primary.error
        ? await supabaseAdmin
              .from('programs')
              .select('id,title,summary,description,imageid,sdggoals')
              .eq('id', id)
              .single()
        : null;

    const data = ((fallback ? fallback.data : primary.data) as any);
    const error = fallback ? fallback.error : primary.error;

    if (error || !data) {
        console.error('Failed to load program from Supabase:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        summary: data.summary,
        description: data.description,
        imageId: data.image_id ?? data.imageid ?? '',
        sdgGoals: data.sdg_goals ?? data.sdggoals ?? [],
        locale: (data.locale as Program['locale']) || 'ng',
    };
}

export default async function EditProgramPage({ params }: Props) {
    const { id } = await params;
    const program = await getProgram(id);
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
