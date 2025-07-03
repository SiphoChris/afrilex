import React from 'react'

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-auto">{children}</main>
  )
}

export default Main