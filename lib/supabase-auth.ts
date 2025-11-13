// lib/supabase-auth.ts
export const signIn = async (email: string, password: string) => {
  // Ici tu peux appeler Supabase ou simuler
  console.log('Connexion', email, password);
  return { user: { email } };
};

export const signUp = async (email: string, password: string) => {
  console.log('Inscription', email, password);
  return { user: { email } };
};
