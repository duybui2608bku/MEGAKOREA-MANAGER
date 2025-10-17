import { TanstackQuery } from '#src/components'
import { setupLoading } from '#src/plugins'
import { createRoot } from 'react-dom/client'

import App from './app'
import './styles/index.css'

async function setupApp() {
  setupLoading()

  const rootElement = document.getElementById('root')
  if (!rootElement) return
  const root = createRoot(rootElement)

  root.render(
    <TanstackQuery>
      <App />
    </TanstackQuery>
  )
}

setupApp()
