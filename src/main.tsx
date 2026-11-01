import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Écran de démarrage (dans index.html) : affiché au moins 5 s, puis fondu.
// Un toucher le fait disparaître tout de suite.
const SPLASH_MIN_MS = 5000
const splash = document.getElementById('splash')
if (splash) {
  let done = false
  const hide = () => {
    if (done) return
    done = true
    const remove = () => splash.remove()
    requestAnimationFrame(() => {
      splash.classList.add('is-hidden')
      splash.addEventListener('transitionend', remove, { once: true })
      setTimeout(remove, 800)
    })
  }
  splash.addEventListener('pointerdown', hide, { once: true })
  setTimeout(hide, Math.max(0, SPLASH_MIN_MS - performance.now()))
}
