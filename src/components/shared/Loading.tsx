
import { BookOpen } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading your books...",
  fullScreen = false,
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-[70vh]" : "min-h-[250px]"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#193829]/15 border-t-[#193829]" />

        <BookOpen size={25} className="text-[#193829]" />
      </div>

      <p className="text-sm font-medium text-[#193829]">
        {message}
      </p>

      <span className="sr-only">Please wait</span>
    </div>
  );
}
