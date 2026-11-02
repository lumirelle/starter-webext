import type { WebNavigation } from 'webextension-polyfill'
import { isFirefox, isForbiddenUrl } from '~/env'

async function injectLatestScripts({ tabId, frameId, url }: WebNavigation.OnCommittedDetailsType) {
  // Filter out non main window events.
  if (frameId !== 0) return

  if (isForbiddenUrl(url)) return

  // inject the latest scripts
  try {
    await browser.tabs.executeScript(tabId, {
      file: `${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`,
      runAt: 'document_end',
    })
  } catch (error) {
    console.error(error)
  }
}

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
//
// The listener itself must stay synchronous; the handler's promise is detached.
browser.webNavigation.onCommitted.addListener(details => {
  void injectLatestScripts(details)
})
