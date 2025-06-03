// src/components/AgentInteraction.tsx
'use client';

import React, { useState } from 'react';

// For MVP, we won't actually call the Python backend from here.
// This will just simulate the interaction or prepare a command.
// Or, for a very simple agent, we could try a direct client-side API call to OpenRouter.

export default function AgentInteraction() {
  const [userName, setUserName] = useState('');
  const [userColor, setUserColor] = useState('');
  const [agentOutput, setAgentOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [runCommand, setRunCommand] = useState('');

  const handleRunAgent = async () => {
    setIsLoading(true);
    setAgentOutput(''); // Clear previous output

    // Construct the command the user would run locally
    const inputJson = JSON.stringify({ name: userName, color: userColor });
    // Path assumes the user runs from the root of 'sovereign-os-mvp'
    const command = `python packages/agent-runner/run_agent.py packages/agent-runner/examples/SimpleGreeter.agent.yaml --input-json '${inputJson}'`;
    setRunCommand(command);

    // ** SIMULATION / PLACEHOLDER **
    // In a real scenario for MVP, we might:
    // 1. Show the command above for the user to run in their terminal.
    // 2. For an ultra-simple agent, try a direct client-side LLM call (more complex for now, involves API key exposure).
    // 3. Later, this would call a backend API endpoint that triggers the Python script.

    // Simulate a delay and show a placeholder message
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAgentOutput("Agent execution simulated. To run for real, use the command shown below in your local terminal (where you have the Python runner and your OpenRouter API key set up).");
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-2xl p-4 mt-8 bg-white dark:bg-zinc-800 shadow-md rounded-lg border border-gray-200 dark:border-zinc-700">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Run Agent: SimpleGreeter</h2>
      
      <div className="mb-4">
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
        <input
          type="text"
          name="userName"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-gray-100"
          placeholder="e.g., A3sh"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="userColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Favorite Color</label>
        <input
          type="text"
          name="userColor"
          id="userColor"
          value={userColor}
          onChange={(e) => setUserColor(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-gray-100"
          placeholder="e.g., blue"
        />
      </div>

      <button
        onClick={handleRunAgent}
        disabled={isLoading || !userName || !userColor}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Running...' : 'Run Agent (Simulated)'}
      </button>

      {agentOutput && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-700 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Agent Output:</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{agentOutput}</p>
        </div>
      )}

      {runCommand && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md">
            <p className="text-xs text-yellow-700 dark:text-yellow-200">
                <strong>To run this for real (locally):</strong> Ensure your Python virtual environment is active and your <code>OPENROUTER_API_KEY</code> is set. Then, from the root <code>sovereign-os-mvp</code> directory, run:
            </p>
            <pre className="mt-1 p-2 bg-black text-white text-xs rounded overflow-x-auto"><code>{runCommand}</code></pre>
        </div>
      )}
    </div>
  );
}