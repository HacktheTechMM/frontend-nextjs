"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "JS",
  },
  {
    id: "python",
    name: "Python",
    icon: "PY",
  },
  {
    id: "c",
    name: "C",
    icon: "C",
  },
]

export default function LanguageSelector({ selectedLanguage, onSelectLanguage }:any) {
  const selected = languages.find((lang) => lang.id === selectedLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="bg-muted rounded px-1 text-xs font-mono">{selected?.icon}</span>
          {selected?.name}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onClick={() => onSelectLanguage(language.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="bg-muted rounded px-1 text-xs font-mono">{language.icon}</span>
              {language.name}
            </div>
            {language.id === selectedLanguage && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
