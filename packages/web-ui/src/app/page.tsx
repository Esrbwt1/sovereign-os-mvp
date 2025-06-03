// src/app/page.tsx
import AgentConfigForm from "@/components/AgentConfigForm"; // Check import alias
import AgentInteraction from "@/components/AgentInteraction";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="w-full max-w-5xl mb-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">SovereignOS™</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">MVP Agent Interface</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 w-full max-w-2xl items-start">
        {/* We'll display them sequentially for now for simplicity */}
        <AgentConfigForm />
        <AgentInteraction />
      </div>

      <footer className="w-full max-w-5xl mt-20 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by the SovereignOS™ Core Engine (Local Python Runner)
        </p>
      </footer>
    </main>
  );
}