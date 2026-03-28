// TODO: Teammate B — Build the main app layout
// See task breakdown in README.md
// Layout should include: TopBar at top, AnatomySidebar on left,
// main 3D viewport in center, ProcedurePanel on right.

export default function Layout() {
  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col">
      {/* TODO: <TopBar /> */}
      <div className="flex flex-1 overflow-hidden">
        {/* TODO: <AnatomySidebar /> */}
        <main className="flex-1 relative">
          {/* TODO: <KneeScene /> */}
        </main>
        {/* TODO: <ProcedurePanel /> */}
      </div>
      <p className="p-4 text-slate-400 absolute bottom-4 left-1/2 -translate-x-1/2">
        Layout placeholder — Teammate B
      </p>
    </div>
  );
}
