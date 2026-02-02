import supabase from './supabase.js'

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    // Si no está logueado, redirige a login
    window.location.href = 'login.html'
    return null
  }
  
  return session
}

export default checkAuth