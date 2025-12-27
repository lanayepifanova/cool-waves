import { useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { ShaderSelector } from "./components/ShaderSelector";
import { SheetReminderInput } from "./components/SheetReminderInput";
import { useReminderManager } from "./components/ReminderManager";
import { CenterReminderDisplay } from "./components/CenterReminderDisplay";
import { SonnerToastProvider } from "./components/SonnerToastProvider";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import "./styles/sonner-fixes.css";
import "./styles/input-fixes.css";

export default function App() {
  const {
    reminders,
    addReminder,
    removeReminder,
    clearAllReminders,
    hasUpcomingReminders,
    markReminderComplete,
  } = useReminderManager();
  const [canvasSize, setCanvasSize] = useState(600);
  const [showInput, setShowInput] = useState(false);
  const [selectedShader, setSelectedShader] = useState(1); // Default to the first shader

  // Set dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Adjust canvas size based on window size
  useEffect(() => {
    const handleResize = () => {
      const size =
        Math.min(window.innerWidth, window.innerHeight) * 0.7;
      setCanvasSize(size);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle sheet visibility when clicking on shader
  const handleCanvasClick = () => {
    setShowInput(true);
  };

  // Handle shader selection
  const handleSelectShader = (id: number) => {
    setSelectedShader(id);
    // Store preference in localStorage for persistence across sessions
    localStorage.setItem("selectedShader", id.toString());
  };

  // Load shader preference from localStorage on initial load
  useEffect(() => {
    const savedShader = localStorage.getItem("selectedShader");
    if (savedShader) {
      setSelectedShader(parseInt(savedShader, 10));
    }
  }, []);

  // Check if there are any active reminders
  const activeRemindersExist =
    reminders.filter((r) => !r.completed).length > 0;

  // Check if there are any upcoming reminders (within 5 minutes)
  const upcomingRemindersExist = hasUpcomingReminders();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
      {/* Sonner Toast Provider */}
      <SonnerToastProvider />

      {/* Shader Selector - Now positioned fixed on the right */}
      <ShaderSelector
        selectedShader={selectedShader}
        onSelectShader={handleSelectShader}
      />

      {/* Main layout container with shader */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Shader Circle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <ShaderCanvas
            size={canvasSize}
            onClick={handleCanvasClick}
            hasActiveReminders={activeRemindersExist}
            hasUpcomingReminders={upcomingRemindersExist}
            shaderId={selectedShader}
          />

          {/* Center Reminder Display */}
          <CenterReminderDisplay
            reminders={reminders}
            onRemove={removeReminder}
            onComplete={markReminderComplete}
            size={canvasSize}
          />
        </motion.div>

        {/* Clear Reminders Button - Fixed position outside circle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: activeRemindersExist ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2"
          style={{
            pointerEvents: activeRemindersExist
              ? "auto"
              : "none",
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={clearAllReminders}
            className="px-8 py-2 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 rounded-full h-auto min-w-[160px] p-[7px] m-[0px] px-[8px] py-[7px]"
            disabled={!activeRemindersExist}
          >
            Clear Reminders
          </Button>
        </motion.div>

        {/* Sheet for Reminder Input */}
        <SheetReminderInput
          open={showInput}
          onOpenChange={setShowInput}
          onAddReminder={addReminder}
        />
      </div>
    </div>
  );
}