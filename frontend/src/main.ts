import './app.css'
import { mount } from 'svelte'
import { addCollection } from '@iconify/svelte/offline'
import keylineIcons from 'virtual:keyline-icons'
import { initLocale } from '#lib/locale.svelte'

addCollection(keylineIcons)

async function start() {
  await initLocale()
  // App.svelte is imported late on purpose: its module builds translated state.
  const { default: App } = await import('./App.svelte')
  mount(App, { target: document.getElementById('app')! })
}

void start()
