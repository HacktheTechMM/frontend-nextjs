"use client"
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
}

export default function CodeEditor({ value, onChange, language = "javascript" }: CodeEditorProps) {
  // In a real application, you would use a proper code editor like Monaco Editor or CodeMirror
  // For simplicity, we're using a textarea with some basic styling

  return (
    <div className="relative h-full w-full border rounded-md overflow-hidden">
      <div className="absolute top-0 right-0 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-bl-md">
        {language}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm p-4 h-full w-full resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
        placeholder="Write your code here..."
      />
    </div>
  )
}
