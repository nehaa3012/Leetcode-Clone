import { syncUser } from "@/lib/syncUser";
import Navbar from "@/components/Navbar";

export default async function RootLayout({ children }) {
    const user = await syncUser();
    const role = user?.role || "USER";
    
    return (
        <div className="relative min-h-screen">
            {/* Modern Background Layer */}
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="flex flex-col min-h-screen">
                <Navbar role={role} />

                <main className="flex-1 container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}

