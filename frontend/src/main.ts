import './app.css'
import { mount } from 'svelte'
import { addCollection } from '@iconify/svelte/offline'
import keylineIcons from 'virtual:keyline-icons'
import App from './App.svelte'

addCollection(keylineIcons)

mount(App, { target: document.getElementById('app')! })
