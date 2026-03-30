import { Suspense } from "react";
import { ClipLoader } from "react-spinners";
import SupportContent from "./SupportContent";

function SupportLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6">
      <ClipLoader size={40} color="#3b82f6" />
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Establishing_Node_Connection</span>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<SupportLoading />}>
      <SupportContent />
    </Suspense>
  );
}
