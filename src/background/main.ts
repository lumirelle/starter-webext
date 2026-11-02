import type { Tabs } from 'webextension-polyfill'
import { onMessage, sendMessage } from 'webext-bridge/background'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  void import('/@vite/client')
  // load latest content script
  void import('./contentScriptHMR')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true

// Chromium's `sidePanel` is not part of the polyfill's Firefox-oriented types.
interface SidePanelApi {
  setPanelBehavior: (options: { openPanelOnActionClick: boolean }) => Promise<void>
}

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  void (async () => {
    try {
      const { sidePanel } = browser as typeof browser & { sidePanel: SidePanelApi }
      await sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    } catch (error) {
      console.error(error)
    }
  })()
}

browser.runtime.onInstalled.addListener((): void => {
  // oxlint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
async function notifyPreviousTab({ tabId }: Tabs.OnActivatedActiveInfoType) {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  } catch {
    return
  }

  // oxlint-disable-next-line no-console
  console.log('previous tab', tab)
  await sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
}

// The listener itself must stay synchronous; the handler's promise is detached.
browser.tabs.onActivated.addListener(activeInfo => {
  void notifyPreviousTab(activeInfo)
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  } catch {
    return {
      title: undefined,
    }
  }
})
