import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-border bg-card/40 backdrop-blur-md py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-3">
          <Link
            className="font-bold text-lg md:text-xl tracking-wider bg-gradient-to-r from-accentIndigo via-purple-500 to-accentCyan bg-clip-text text-transparent"
            href={"/"}
          >
            PC BUILDER
          </Link>
          <p className="text-sm text-text/60 leading-relaxed">
            Build your dream rig with real-time compatibility checking and performance insights.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-accentCyan mb-3">
            Platform
          </h4>
          <div className="flex flex-col gap-2">
            <Link href="/introduction" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">
              Introduction
            </Link>
            <Link href="/guide" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">
              Builder Guide
            </Link>
            <Link href="/part" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">
              Parts Directory
            </Link>
            <Link href="/build" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">
              System Builder
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-accentCyan mb-3">
            Categories
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/part/cpu" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">CPU</Link>
            <Link href="/part/graphic_card" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">GPU</Link>
            <Link href="/part/main" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">Motherboard</Link>
            <Link href="/part/ram" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">RAM</Link>
            <Link href="/part/ssd" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">SSD</Link>
            <Link href="/part/case" className="text-sm text-text/70 hover:text-accentIndigo transition-colors">Case</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-accentCyan mb-3">
            System
          </h4>
          <p className="text-sm text-text/70 mb-4 leading-relaxed">
            Crafted with modern tools for custom hardware planners.
          </p>
          <span className="text-xs text-text/50 block">
            © {new Date().getFullYear()} PC Builder.
          </span>
        </div>
      </div>
    </footer>
  );
}
