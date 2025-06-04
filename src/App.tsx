import React from "react";
import { ContactForm } from "./components/ContactForm";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <ContactForm />
      <Toaster />
    </div>
  );
}

export default App;