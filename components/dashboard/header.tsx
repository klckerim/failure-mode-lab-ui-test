"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { MobileSidebar } from "./mobile-sidebar"

interface HeaderProps {
  onNewRun?: () => void
}

export function Header({ onNewRun }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <MobileSidebar />
            </SheetContent>
          </Sheet>
          
          <div className="relative w-64 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search runs, scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-border"
              aria-label="Search runs and scenarios"
            />
          </div>
        </div>

        <Button onClick={onNewRun} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">New Run</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  )
}
