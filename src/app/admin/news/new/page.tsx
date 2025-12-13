import NewsForm from "../NewsForm";

export default function NewNewsArticlePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Create New News Article</h1>
                <p className="text-muted-foreground">Fill in the details below to publish a new news article.</p>
            </div>
            <NewsForm />
        </div>
    )
}
