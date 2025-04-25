"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LearnerProfileForm() {
  return (
    <form className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" placeholder="Enter your age" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">School Grade</Label>
          <Select>
            <SelectTrigger id="grade">
              <SelectValue placeholder="Select your grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">Elementary School</SelectItem>
              <SelectItem value="middle">Middle School</SelectItem>
              <SelectItem value="high">High School</SelectItem>
              <SelectItem value="college">College/University</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact</Label>
          <Input id="contact" type="text" placeholder="Phone number or email" />
          <p className="text-sm text-muted-foreground">How would you prefer to be contacted?</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Learning Goals</Label>
          <Textarea id="goals" placeholder="What do you hope to achieve through mentoring?" className="min-h-[100px]" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="special-needs">Special Needs</Label>
          <Textarea
            id="special-needs"
            placeholder="Any special accommodations or learning needs we should be aware of"
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            This information will only be shared with your assigned mentor.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" type="text" placeholder="City, State/Province, Country" />
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Update Profile
      </Button>
    </form>
  )
}
