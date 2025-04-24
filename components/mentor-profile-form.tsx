"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function MentorProfileForm() {
  const [date, setDate] = useState<Date>()

  return (
    <form className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself, your background, and your teaching philosophy"
            className="min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground">This will be displayed on your public profile.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          <Textarea
            id="experience"
            placeholder="Describe your teaching experience, qualifications, and areas of expertise"
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="start-time" className="text-sm">
                Availability Time
              </Label>
              <Input id="start-time" type="time" className="mt-1" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Update Profile
      </Button>
    </form>
  )
}
