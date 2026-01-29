import React from 'react'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({ open, title = 'Are you sure?', description, confirmLabel = 'Delete', cancelLabel = 'Cancel', onConfirm, onClose }: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-card/60 backdrop-blur-lg border border-accent/20 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          {description && <p className="text-sm text-foreground/60 mb-4">{description}</p>}
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-background/50 text-foreground/70 hover:bg-accent/10">{cancelLabel}</button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
