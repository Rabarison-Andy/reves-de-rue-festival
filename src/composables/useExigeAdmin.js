import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

export function useExigeAdmin() {
  const authStore = useAuthStore()
  const router = useRouter()

  watch(
    () => authStore.estAdmin,
    (estAdmin) => {
      if (!estAdmin) {
        router.push({ name: 'accueil' })
      }
    },
  )
}
