'use client'

import { useState } from 'react'
import { createTopicAction } from '@/app/actions'
import { Plus, FolderPlus } from 'lucide-react'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Button,
} from '@/components/ui'
import { cn } from '@/lib/utils'

const COLOR_OPTIONS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
]

export function CreateTopicModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('color', selectedColor)

    const res = await createTopicAction(formData)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        New Topic
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogHeader>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>Group scenario cashflows under a custom project</DialogDescription>
          </div>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Topic Name"
            name="name"
            type="text"
            required
            placeholder="e.g. Home Renovation, Side Project"
          />

          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="Brief note on what this topic represents..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-emerald-500 text-slate-100 text-sm outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Topic Color Tag</label>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    'w-7 h-7 rounded-full transition transform cursor-pointer',
                    selectedColor === c
                      ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                      : 'hover:scale-110'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Topic
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
