"use client";
import { useState } from "react";

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* IMAGE AREA */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/sample.jpg"
          alt="preview"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* PANEL */}
      {activeTab && (
        <div className="bg-zinc-900 p-4">
          {activeTab === "actions" && (
            <div className="flex gap-4 overflow-x-auto">
              <button>Auto</button>
              <button>Améliorer</button>
              <button>Sujet</button>
              <button>Ciel</button>
            </div>
          )}

          {activeTab === "filters" && (
            <div className="flex gap-4 overflow-x-auto">
              <button>Subtil</button>
              <button>Forte</button>
              <button>N&B</button>
              <button>Froid</button>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="bg-zinc-950 flex justify-around py-3">
        <button onClick={() => setActiveTab("actions")}>Actions</button>
        <button onClick={() => setActiveTab("filters")}>Filtres</button>
        <button onClick={() => setActiveTab("crop")}>Recadrage</button>
        <button onClick={() => setActiveTab("adjust")}>Modifier</button>
        <button onClick={() => setActiveTab("mask")}>Masquage</button>
      </div>
    </div>
  );
}