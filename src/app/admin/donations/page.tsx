import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function AdminDonationsPage() {

    return (
        <div className="space-y-8">
             <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold font-headline">Donations</h1>
                    <p className="text-muted-foreground">Review donation records and analytics.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Donation Records</CardTitle>
                    <CardDescription>
                        This feature is currently under development. Once live, all donation records will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8 text-muted-foreground">
                        No donation records yet.
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
