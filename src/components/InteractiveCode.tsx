'use client'

import React, { useState, useEffect } from 'react';


const InteractiveCode: React.FC = () => {
  const [code, setCode] = useState<string[]>([
    "function greet(name) {",
    "  return `Hello, ${name}!`;",
    "}",
    "",
    "// The name below will be used in the greeting",
    "console.log(greet(name));"
  ]);

  const [name, setName] = useState<string>("Visitor");
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    try {
      const func = new Function('name', `
        ${code.join('\n')}
        return greet(name);
      `);
      setOutput(func(name));
    } catch (error) {
      setOutput("Error: " + (error as Error).message);
    }
  }, [code, name]);

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  return (
    <div className={`bg-gray-900 p-6 rounded-2xl shadow-lg md:col-span-1 lg:col-span-2 flex-grow`}>
      <h2 className="text-2xl font-bold mb-4 text-white">Interactive Code Snippet</h2>
      <div className="mb-4">
        {code.map((line, index) => (
          <input
            key={index}
            value={line}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            className="w-full bg-gray-800 text-green-400 p-1 font-mono text-sm mb-1 rounded"
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Enter a name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded"
          placeholder="Enter a name"
        />
      </div>
      <div className="bg-black p-4 rounded-lg">
        <p className="text-white font-mono">Output: <span className="text-yellow-400">{output}</span></p>
      </div>
    </div>
  );
}

export default InteractiveCode;