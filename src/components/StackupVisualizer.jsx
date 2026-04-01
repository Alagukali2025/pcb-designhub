import React from 'react';
import { Layers, Zap, ShieldAlert, AlertTriangle, Check } from 'lucide-react';

const StackupVisualizer = () => {
  const layers = [
    { type: 'mask', label: 'Top Solder Mask', sub: 'Liquid Photoimageable (LPI)', color: '#2e7d32', h: 32, id: '', thickness: '25μm' },
    { type: 'copper', label: 'L1: Signal (Microstrip)', sub: 'Top Signal Layer', color: '#f97316', h: 40, id: 'L1', thickness: '35μm' },
    { type: 'dielectric', label: 'Prepreg Dielectric', sub: 'Resin-Rich Bonding Layer', color: '#475569', h: 80, id: '', thickness: '100μm' },
    { type: 'copper', label: 'L2: Ground Plane', sub: 'Primary Reference Plane', color: '#fbbf24', h: 40, id: 'L2', thickness: '35μm' },
    { type: 'dielectric', label: 'Core Dielectric', sub: 'Cured Glass-Material', color: '#334155', h: 120, id: '', thickness: '200μm' },
    { type: 'copper', label: 'L3: Signal (Stripline)', sub: 'Internal Signal Layer', color: '#f97316', h: 40, id: 'L3', thickness: '35μm' },
    { type: 'dielectric', label: 'Prepreg Dielectric', sub: 'Low-Loss Bonding Layer', color: '#475569', h: 80, id: '', thickness: '100μm' },
    { type: 'copper', label: 'L4: Power Plane', sub: 'Internal Power Distribution', color: '#fbbf24', h: 40, id: 'L4', thickness: '35μm' },
    { type: 'dielectric', label: 'Core Dielectric', sub: 'Mid-Plane Isolation', color: '#0f172a', h: 140, id: '', thickness: '200μm', isMid: true },
    { type: 'copper', label: 'L5: Ground Plane', sub: 'Reference Plane', color: '#fbbf24', h: 40, id: 'L5', thickness: '35μm' },
    { type: 'dielectric', label: 'Prepreg Dielectric', sub: 'Low-Loss Bonding Layer', color: '#475569', h: 80, id: '', thickness: '100μm' },
    { type: 'copper', label: 'L6: Signal (Stripline)', sub: 'Internal Signal Layer', color: '#f97316', h: 40, id: 'L6', thickness: '35μm' },
    { type: 'dielectric', label: 'Core Dielectric', sub: 'Cured Glass-Material', color: '#334155', h: 120, id: '', thickness: '200μm' },
    { type: 'copper', label: 'L7: Ground Plane', sub: 'Primary Reference Plane', color: '#fbbf24', h: 40, id: 'L7', thickness: '35μm' },
    { type: 'dielectric', label: 'Prepreg Dielectric', sub: 'Resin-Rich Bonding Layer', color: '#475569', h: 80, id: '', thickness: '100μm' },
    { type: 'copper', label: 'L8: Signal (Microstrip)', sub: 'Bottom Signal Layer', color: '#f97316', h: 40, id: 'L8', thickness: '35μm' },
    { type: 'mask', label: 'Bottom Solder Mask', sub: 'Liquid Photoimageable (LPI)', color: '#2e7d32', h: 32, id: '', thickness: '25μm' },
  ];

  return (
    <div className="stackup-visualizer-final slide-up p-4 md:p-12 bg-[#0a0f1d] border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="mb-20 text-center relative z-10">
        <div className="inline-flex flex-col items-center">
          <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-glow">
            <Layers size={40} className="text-blue-400" />
          </div>
          <h4 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic leading-[0.85]">
            8-Layer Standard <span className="text-blue-500">High-Speed</span> Stackup
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
             <div className="px-6 py-2 bg-blue-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase">SYMMETRIC SSOT</div>
             <div className="px-6 py-2 bg-white/5 border border-white/10 text-white/60 rounded-full text-[10px] font-black tracking-widest uppercase italic">Standard 1.6mm Lamination</div>
          </div>
        </div>
      </div>

      {/* Main Visualizer Container */}
      <div className="max-w-6xl mx-auto space-y-3 relative z-10">
        {layers.map((layer, idx) => (
          <div key={idx} className={`group/row grid grid-cols-[60px_1fr_300px] lg:grid-cols-[100px_1fr_400px] items-center gap-6 lg:gap-16 relative ${layer.isMid ? 'py-6' : ''}`}>
            
            {/* Mid-Plane Indicator */}
            {layer.isMid && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-30">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="px-5 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_30px_rgba(37,99,235,0.8)] mx-4">
                  Symmetry Axis
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              </div>
            )}

            {/* Column 1: ID */}
            <div className="text-right">
              <span className="text-base lg:text-2xl font-black text-white/20 group-hover/row:text-blue-400 group-hover/row:scale-125 transition-all duration-500 block transform">
                {layer.id}
              </span>
            </div>

            {/* Column 2: The Visual Bar (Solid Height via Style) */}
            <div className="relative w-full rounded-2xl shadow-lg border border-white/10 overflow-hidden cursor-pointer group-hover/row:border-blue-400/50 group-hover/row:scale-[1.02] transition-all duration-700 box-border"
                 style={{ height: `${layer.h}px`, backgroundColor: layer.color }}>
               
               {/* Depth & Light effects */}
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-40" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
               
               {/* Dielectric Hatching */}
               {layer.type === 'dielectric' && (
                 <div className="absolute inset-0 opacity-[0.15]" 
                      style={{ backgroundImage: `repeating-linear-gradient(${idx % 2 === 0 ? '45' : '-45'}deg, #fff, #fff 1px, transparent 1px, transparent 20px)` }} />
               )}

               {/* Hover Glow */}
               <div className={`absolute inset-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-700 ${
                 layer.type === 'copper' ? 'bg-orange-500/10' : layer.type === 'mask' ? 'bg-green-500/10' : 'bg-blue-500/5'
               }`} />
            </div>

            {/* Column 3: The Technical Legend */}
            <div className="flex items-center gap-6 group-hover/row:translate-x-8 transition-all duration-500">
               <div className={`w-3 h-12 rounded-full shadow-inner transition-all duration-700 ${
                 layer.type === 'copper' ? 'bg-orange-600/20 group-hover/row:bg-orange-500 group-hover/row:shadow-[0_0_20px_rgba(249,115,22,0.6)]' :
                 layer.type === 'mask' ? 'bg-green-600/20 group-hover/row:bg-green-500 group-hover/row:shadow-[0_0_20px_rgba(34,197,94,0.6)]' :
                 'bg-white/5 group-hover/row:bg-blue-500 group-hover/row:shadow-[0_0_20px_rgba(59,130,246,0.6)]'
               }`} />

               <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[15px] lg:text-[17px] font-black text-white tracking-tighter uppercase truncate leading-none">
                      {layer.label}
                    </span>
                    <span className="shrink-0 px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-[10px] font-black text-white/50 shadow-2xl">
                      {layer.thickness}
                    </span>
                  </div>
                  <span className="text-[10px] lg:text-[11px] font-black text-white/30 uppercase tracking-[0.25em] group-hover/row:text-white/70 transition-colors">
                    {layer.sub}
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Physics & Integrity Section */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] group hover:bg-white/[0.04] transition-all hover:border-orange-500/30">
          <div className="flex gap-8 items-start">
             <div className="shrink-0 w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <ShieldAlert className="text-orange-500" size={32} />
             </div>
             <div>
                <h5 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Lamination Physics</h5>
                <p className="text-[14px] text-white/60 leading-relaxed font-bold italic border-l-4 border-orange-500/30 pl-8 group-hover:border-orange-500 transition-all">
                  Symmetric material selection is CRITICAL. Mismatching glass weave styles or core heights leads to catastrophic board bowing during thermal reflow cycles. Always ensure the stack is perfectly mirrored about the mid-plane.
                </p>
             </div>
          </div>
        </div>

        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] group hover:bg-white/[0.04] transition-all hover:border-blue-500/30">
          <div className="flex gap-8 items-start">
             <div className="shrink-0 w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Zap className="text-blue-500" size={32} />
             </div>
             <div>
                <h5 className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">SSOT Engineering</h5>
                <p className="text-[14px] text-white/60 leading-relaxed font-bold italic border-l-4 border-blue-500/30 pl-8 group-hover:border-blue-500 transition-all">
                  Specify all laminates using IPC-4101 slash sheets. For high-speed internal striplines (L3/L6), ensure ultra-low loss (low Df) materials are used to maintain eye diagram health and minimize attenuation.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default StackupVisualizer;
