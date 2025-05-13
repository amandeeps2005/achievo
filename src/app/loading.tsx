import LoadingSpinner from "@/components/loading-spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[100]">
      <LoadingSpinner size={64} />
      <p className="mt-4 text-lg text-foreground font-semibold">Loading Achievo...</p>
    </div>
  );
}
