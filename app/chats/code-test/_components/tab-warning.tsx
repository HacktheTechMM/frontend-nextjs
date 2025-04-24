"use client"

import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface TabWarningProps {
  count: number
  isOpen: boolean
  onClose: () => void
  isRedirecting: boolean
}

export default function TabWarning({ count, isOpen, onClose, isRedirecting }: TabWarningProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Tab Switching Detected
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="py-2">
          {count < 5 ? (
            <>
              <div className="mb-2">
                We've detected that you switched away from this tab. Using external resources during the test is not
                allowed.
              </div>
              <div className="font-semibold">
                Warning {count}/5. After 5 warnings, your test will be automatically submitted.
              </div>
            </>
          ) : (
            <div className="text-red-500 font-semibold">
              You've switched tabs too many times. Your test is being submitted automatically.
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button disabled={isRedirecting}>{isRedirecting ? "Redirecting..." : "I Understand"}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
