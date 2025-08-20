import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-14 w-full rounded-xl border border-cocoa-brown/20 bg-creamy-beige/50 dark:bg-dark-bg dark:border-warm-gray/50 px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-warm-gray dark:placeholder:text-dark-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-caramel focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }