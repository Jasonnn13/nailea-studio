export const smoothScrollTo = (targetY: number) => {
  const startY = window.scrollY
  const distance = targetY - startY
  const duration = 800 // ms - slower scroll
  let startTime: number | null = null

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out cubic for gentle deceleration
    const ease = 1 - Math.pow(1 - progress, 3)
    
    window.scrollTo(0, startY + distance * ease)
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }
  
  requestAnimationFrame(animation)
}

export const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault()
  const element = document.getElementById(targetId.replace('#', ''))
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset
    smoothScrollTo(offsetPosition)
  }
}

export const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  smoothScrollTo(0)
}
