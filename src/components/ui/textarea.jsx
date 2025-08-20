import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-cocoa-brown/20 bg-creamy-beige/50 dark:bg-dark-bg dark:border-warm-gray/50 px-4 py-3 text-base ring-offset-background placeholder:text-warm-gray dark:placeholder:text-dark-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-caramel focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }