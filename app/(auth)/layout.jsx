import Link from "next/link";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse pointer-events-none" />

            {/* Header / Branding */}
            <div className="relative z-10 mb-8 text-center">
                <Link href="/" className="inline-block">
                    <h1 className="text-4xl font-black tracking-tighter gradient-text mb-2">
                        BitMaster
                    </h1>
                </Link>
                <p className="text-muted-foreground text-sm font-medium tracking-wide">
                    Step into the arena of competitive excellence
                </p>
            </div>

            {/* Main Auth Container */}
            <div className="relative z-10 w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20" />
                <div className="relative bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-center shadow-2xl">
                    {children}
                </div>
            </div>

            {/* Footer / Links */}
            <div className="relative z-10 mt-8 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} BitMaster. All rights reserved.
            </div>
        </div>
    );
}
