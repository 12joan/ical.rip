import { useState } from 'react'
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

function App() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log({
      title,
      date,
      startTime,
      endTime,
      description
    })

    e.preventDefault()
  }

  return (
    <main className="sm:mt-[20vh] p-3 max-w-screen-sm mx-auto">
      <h1 className="font-bold text-2xl sm:text-3xl mb-3 sm:mb-6">Create a calendar event</h1>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>

          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My fabulous event"
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="date">Date</Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="start-time">Start time</Label>

            <Input
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="10:00"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="end-time">End time</Label>

            <Input
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="11:00"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>

          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description"
          />
        </div>

        <div className="flex max-sm:flex-col gap-2">
          <Button type="submit">Download .ical file</Button>
          <Button variant="outline" type="reset">Reset form</Button>
        </div>
      </form>
    </main>
  )
}

export default App
