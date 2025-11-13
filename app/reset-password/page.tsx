'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { resetPassword } from '@/lib/supabase-auth';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email requis');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
      setError('Impossible d\'envoyer l\'email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email envoyé !
          </h2>
          <p className="text-gray-600 mb-6">
            Vérifiez votre boîte mail et suivez les instructions pour réinitialiser votre mot de passe.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <button
              onClick={() => router.push('/auth')}
              className="flex items-center gap-2 text-indigo-100 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
            <h2 className="text-3xl font-bold mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-indigo-100">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="vous@exemple.com"
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Envoyer le lien</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{' '}
              <button
                onClick={() => router.push('/auth')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}