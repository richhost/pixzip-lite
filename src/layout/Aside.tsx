import TrafficLight from "@/components/TrafficLight";
import FromSection from "@/components/FormSection";

export default function Aside() {
  return (
    <aside className="w-60 flex flex-col h-screen border-r bg-slate-50">
      <div className="h-[50px] window-drag flex-shrink-0">
        <TrafficLight />
      </div>

      <FromSection />
    </aside>
  );
}
