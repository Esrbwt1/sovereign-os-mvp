// src/components/AgentConfigForm.tsx
'use client'; // This directive is needed for components with interactivity

import React, { useState } from 'react';

// Define a basic type for our agent configuration for now
// This should eventually match our agent.schema.json structure
interface AgentConfig {
  name: string;
  description: string;
  llm_config: {
    model: string;
    temperature?: number;
  };
  prompt_template: string;
  // Add more fields as needed from your schema
}

// Hardcode the SimpleGreeter data for now
const initialAgentData: AgentConfig = {
  name: "SimpleGreeter",
  description: "A basic agent that greets a user by name and mentions their favorite color.",
  llm_config: {
    model: "mistralai/mistral-7b-instruct", // The one that worked for you
    temperature: 0.5,
  },
  prompt_template: `You are a friendly and concise assistant.
A user will provide their name and their favorite color.
Your task is to greet them warmly by name and make a positive comment about their favorite color.
Keep your response to 1-2 sentences.

User's Name: {{name}}
Favorite Color: {{color}}`,
};

export default function AgentConfigForm() {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(initialAgentData);

  // Basic handler for future input changes (not fully implemented yet)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Basic nested state update for llm_config.model as an example
    if (name === "llm_model") {
        setAgentConfig(prev => ({ ...prev, llm_config: { ...prev.llm_config, model: value } }));
    } else if (name === "prompt_template") {
        setAgentConfig(prev => ({ ...prev, prompt_template: value }));
    }
    else {
        setAgentConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 bg-white dark:bg-zinc-800 shadow-md rounded-lg border border-gray-200 dark:border-zinc-700">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Agent Configuration</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={agentConfig.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-gray-100"
          readOnly // For now, make it read-only until we implement proper state management
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={agentConfig.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-gray-100"
          readOnly
        />
      </div>

      <div className="mb-4">
        <label htmlFor="llm_model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LLM Model</label>
        <input
          type="text"
          name="llm_model" // Corresponds to handleChange logic
          id="llm_model"
          value={agentConfig.llm_config.model}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-gray-100"
          // readOnly // Let's make this one editable to test handleChange
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="prompt_template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Template</label>
        <textarea
          name="prompt_template"
          id="prompt_template"
          rows={10}
          value={agentConfig.prompt_template}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs dark:bg-zinc-700 dark:text-gray-100"
        />
      </div>
      
      {/* Add more fields here as needed */}
      
    </div>
  );
}