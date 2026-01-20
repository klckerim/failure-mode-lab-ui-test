"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { Scenario } from "@/lib/types"

interface ScenarioMultiSelectProps {
  scenarios: Scenario[]
  selectedIds: string[]
  onSelectedChange: (ids: string[]) => void
  className?: string
}

export function ScenarioMultiSelect({
  scenarios,
  selectedIds,
  onSelectedChange,
  className,
}: ScenarioMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (scenarioId: string) => {
    if (selectedIds.includes(scenarioId)) {
      onSelectedChange(selectedIds.filter((id) => id !== scenarioId))
    } else {
      onSelectedChange([...selectedIds, scenarioId])
    }
  }

  const handleRemove = (scenarioId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectedChange(selectedIds.filter((id) => id !== scenarioId))
  }

  const selectedScenarios = scenarios.filter((s) => selectedIds.includes(s.id))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Filter by scenarios"
          className={cn("w-full justify-between sm:w-[220px]", className)}
        >
          {selectedIds.length === 0 ? (
            <span className="text-muted-foreground">All Scenarios</span>
          ) : selectedIds.length === 1 ? (
            <span className="truncate">{selectedScenarios[0]?.name}</span>
          ) : (
            <span>{selectedIds.length} selected</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search scenarios..." />
          <CommandList>
            <CommandEmpty>No scenario found.</CommandEmpty>
            <CommandGroup>
              {scenarios.map((scenario) => (
                <CommandItem
                  key={scenario.id}
                  value={scenario.name}
                  onSelect={() => handleSelect(scenario.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIds.includes(scenario.id) ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span>{scenario.name}</span>
                    <span className="text-xs text-muted-foreground">{scenario.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedIds.length > 0 && (
          <div className="border-t p-2">
            <div className="flex flex-wrap gap-1">
              {selectedScenarios.map((scenario) => (
                <Badge
                  key={scenario.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span className="max-w-[100px] truncate">{scenario.name}</span>
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    onClick={(e) => handleRemove(scenario.id, e)}
                    aria-label={`Remove ${scenario.name} filter`}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
