'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AppThemeProvider({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}