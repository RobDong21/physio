const PREFS_KEY = 'physio-voice'

export function getVoiceEnabled() {
  const stored = localStorage.getItem(PREFS_KEY)
  return stored === null ? true : stored === '1'
}

export function setVoiceEnabled(on) {
  localStorage.setItem(PREFS_KEY, on ? '1' : '0')
}

export function speak(text) {
  if (!getVoiceEnabled()) return
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1.05
  utterance.pitch = 1
  utterance.volume = 1
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
