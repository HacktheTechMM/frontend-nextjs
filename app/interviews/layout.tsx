import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex mx-auto max-w-7xl flex-col gap-12 px-16 max-sm:px-4 max-sm:my-8">
      <span className="py-4"></span>
      {children}
    </div>
  )
}

export default layout
