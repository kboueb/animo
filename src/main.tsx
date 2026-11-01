import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Écran de démarrage (dans index.html) : affiché au moins 0,6 s, puis fondu
const splash = document.getElementById('splash')
if (splash) {
  const remove = () => splash.remove()
  setTimeout(() => {
    requestAnimationFrame(() => {
      splash.classList.add('is-hidden')
      splash.addEventListener('transitionend', remove, { once: true })
      setTimeout(remove, 800)
    })
  }, Math.max(0, 600 - performance.now()))
}
