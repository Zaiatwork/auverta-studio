'use client'

import { useCallback, useEffect, useReducer, useRef } from 'react'
import { ApiError } from '@/lib/api/client'
import { sendContact, type ContactPayload } from '@/lib/api/contact'
import { CONTACT_EMAIL } from '@/lib/config/env'

export type ContactStatus = { kind: 'idle' | 'sending' | 'error' | 'sent'; message?: string }

type Action = { type: 'invalid' } | { type: 'sending' } | { type: 'sent' } | { type: 'failed'; reason: string }

const reducer = (_: ContactStatus, action: Action): ContactStatus => {
  switch (action.type) {
    case 'invalid':
      return { kind: 'error', message: 'Please complete the highlighted fields.' }
    case 'sending':
      return { kind: 'sending', message: 'Sending...' }
    case 'sent':
      return { kind: 'sent', message: 'Thank you. We will reply within one working day.' }
    case 'failed':
      return { kind: 'error', message: `${action.reason} You can also write to ${CONTACT_EMAIL}.` }
  }
}

/** State machine for the contact form: idle → sending → sent | error. */
export function useContactForm() {
  const [status, dispatch] = useReducer(reducer, { kind: 'idle' })
  const openedAt = useRef(0)
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  const submit = useCallback(async (form: HTMLFormElement) => {
    if (!form.checkValidity()) {
      form.reportValidity()
      dispatch({ type: 'invalid' })
      return
    }
    dispatch({ type: 'sending' })
    const data = Object.fromEntries(new FormData(form)) as Omit<ContactPayload, 'elapsed'>
    try {
      await sendContact({ ...data, elapsed: Date.now() - openedAt.current })
      form.reset()
      dispatch({ type: 'sent' })
    } catch (err) {
      // Only server-authored messages are shown verbatim; anything else gets a generic line.
      const reason = err instanceof ApiError && err.fromServer ? err.message : 'Could not send.'
      dispatch({ type: 'failed', reason })
    }
  }, [])

  return { status, submit }
}
