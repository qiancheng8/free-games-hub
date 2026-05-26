export const useTheme = () => {
  const isDark = useState('theme-dark', () => false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
    saveTheme()
  }

  const applyTheme = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const saveTheme = () => {
    if (process.client) {
      localStorage.setItem('theme-dark', JSON.stringify(isDark.value))
    }
  }

  const loadTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('theme-dark')
      if (saved !== null) {
        isDark.value = JSON.parse(saved)
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
    }
  }

  onMounted(() => {
    loadTheme()
  })

  return {
    isDark,
    toggleTheme,
  }
}
