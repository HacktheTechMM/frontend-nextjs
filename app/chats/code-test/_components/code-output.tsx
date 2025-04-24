"use client"

interface CodeOutputProps {
  output: string
}

export default function CodeOutput({ output }: CodeOutputProps) {
  return (
    <div className="h-full w-full border rounded-md overflow-hidden bg-zinc-950 text-white">
      <div className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 font-mono border-b border-zinc-700 flex items-center">
        <span>Output</span>
      </div>
      <pre className="p-3 font-mono text-sm overflow-auto h-[calc(100%-28px)]">{output}</pre>
    </div>
  )
}
