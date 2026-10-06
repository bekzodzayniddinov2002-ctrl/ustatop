// Oqimli mesh-gradient fon: to'q ko'k, binafsha va qora ranglardagi xiralashgan "blob"lar
export function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05060f]">
      <div className="absolute -left-[10%] -top-[15%] h-[60vmax] w-[60vmax] rounded-full bg-indigo-700/50 blur-[120px] animate-blob-1" />
      <div className="absolute -right-[15%] top-[10%] h-[55vmax] w-[55vmax] rounded-full bg-violet-700/45 blur-[130px] animate-blob-2" />
      <div className="absolute -bottom-[25%] left-[20%] h-[50vmax] w-[50vmax] rounded-full bg-blue-900/60 blur-[120px] animate-blob-3" />
      <div className="absolute bottom-[5%] right-[10%] h-[30vmax] w-[30vmax] rounded-full bg-fuchsia-800/30 blur-[110px] animate-blob-1 [animation-delay:-8s]" />
      {/* Yengil shovqin va qorong'i vinyetka */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_75%)]" />
    </div>
  );
}
