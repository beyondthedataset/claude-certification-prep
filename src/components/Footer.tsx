export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0E12] border-t border-white/[0.07] py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-headline text-sm text-white font-semibold">CertPulse</span>
          <span className="text-[12px] text-on-surface-variant">• Precision Certification Engineering</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-[12px] font-mono text-on-surface-variant">
          <span className="text-on-surface-variant/70">LATENCY: 12ms</span>
          <span className="text-emerald-400">ENGINE READY</span>
          <span className="text-on-surface-variant/70">© 2026 CertPulse Studio</span>
        </div>
      </div>
    </footer>
  );
}
