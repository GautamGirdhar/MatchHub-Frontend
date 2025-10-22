import React from "react";
import dynamic from "next/dynamic";

// ResponsiveNav must be a client component (it uses hooks). Import it dynamically
// from this server layout WITHOUT `ssr: false`. `ssr: false` is not allowed in
// server components — omitting it lets Next load the client component on the client.
const ResponsiveNav = dynamic(
    () => import("@/components/Navigation/ResponsiveNav"),
    { loading: () => <div /> }
);

export default function InternalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen md:flex">
            {/* nav only rendered for pages inside (internal-pages) */}
            <ResponsiveNav />

            {/* reserve sidebar width on desktop so content doesn't overlap */}
            <main className="flex-1 md:pl-72">
                {children}
            </main>
        </div>
    );
}
