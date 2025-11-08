import { User } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <div className="text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h1 className="mt-4 text-2xl font-semibold">Profile Page</h1>
                <p className="mt-2 text-muted-foreground">This page is under construction.</p>
            </div>
        </div>
    )
}
