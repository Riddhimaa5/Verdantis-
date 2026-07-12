/**
 * ChallengeDeleteConfirmModal.jsx
 * Lightweight delete guard — mirrors CSRDeleteConfirmModal exactly.
 */

import Modal from '../common/Modal'
import Button from '../common/Button'
import { Trash2 } from 'lucide-react'

export default function ChallengeDeleteConfirmModal({ open, onClose, onConfirm, challengeTitle }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Challenge">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-danger" />
          </div>
          <div>
            <p className="text-sm text-ink-700">
              Are you sure you want to delete{' '}
              <span className="font-semibold">"{challengeTitle}"</span>?
            </p>
            <p className="text-xs text-ink-400 mt-1">
              All participation records for this challenge will also be removed. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1 border-t border-ink-100">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onConfirm} className="bg-danger hover:bg-red-700 text-white border-0">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
