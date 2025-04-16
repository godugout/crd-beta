
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

export function ThemeToggle() {
  const { visualEffectsEnabled, setVisualEffectsEnabled } = useSettings();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setVisualEffectsEnabled(!visualEffectsEnabled)}
      aria-label="Toggle visual effects"
      className="text-white bg-black/20 hover:bg-black/30 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <Sparkles className={`h-5 w-5 ${visualEffectsEnabled ? "text-purple-400" : "text-gray-400"}`} />
    </Button>
  );
}
