'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, MapPin, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const AppointmentForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    prenom: '',
    phone: '',
    email: '',
    date: '',
    heure: '',
    lieu: '',
    conseiller: '',
    objet: '',
    langue: 'FR'
  });

  const [errors, setErrors] = useState({});
  const supabase = createClientComponentClient();

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
      if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
      else if (!/^[\d\s+()-]+$/.test(formData.phone)) newErrors.phone = 'Numéro invalide';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'La date est requise';
      if (!formData.heure) newErrors.heure = "L'heure est requise";
      if (!formData.objet.trim()) newErrors.objet = "L'objet est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    console.log('🔍 Validation étape 2...');
    if (!validateStep(step)) {
      console.log('❌ Validation échouée');
      return;
    }
    
    console.log('✅ Validation réussie, envoi des données...');
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        prenom: formData.prenom,
        phone: formData.phone,
        email: formData.email || null,
        date: formData.date,
        heure: formData.heure,
        lieu: formData.lieu || null,
        conseiller: formData.conseiller || null,
        objet: formData.objet,
        langue: formData.langue,
        statut: 'SCHEDULED'
      };

      console.log('📤 Données envoyées:', payload);

      const { data, error } = await supabase
        .from('appointments')
        .insert(payload)
        .select();

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Rendez-vous créé:', data);
      setSubmitStatus('success');
      setStep(3);
    } catch (error) {
      console.error('❌ Erreur complète:', error);
      setSubmitStatus('error');
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Prendre Rendez-vous</h1>
          <p className="text-blue-100">Complétez le formulaire en quelques étapes</p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  animate={{
                    scale: step >= s ? 1 : 0.8,
                    backgroundColor: step >= s ? '#3B82F6' : '#E5E7EB'
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                >
                  {step > s ? <Check size={20} /> : s}
                </motion.div>
                {s < 3 && (
                  <motion.div
                    animate={{
                      backgroundColor: step > s ? '#3B82F6' : '#E5E7EB'
                    }}
                    className="flex-1 h-1 mx-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Informations personnelles */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-2" size={16} />
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.prenom && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.prenom}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline mr-2" size={16} />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+33 6 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select
                    name="langue"
                    value={formData.langue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="FR">Français</option>
                    <option value="EN">English</option>
                  </select>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Détails du rendez-vous */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline mr-2" size={16} />
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline mr-2" size={16} />
                      Heure *
                    </label>
                    <input
                      type="time"
                      name="heure"
                      value={formData.heure}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.heure ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.heure && (
                      <p className="text-red-500 text-sm mt-1">{errors.heure}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Lieu
                  </label>
                  <input
                    type="text"
                    name="lieu"
                    value={formData.lieu}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Adresse du rendez-vous"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-2" size={16} />
                    Conseiller
                  </label>
                  <input
                    type="text"
                    name="conseiller"
                    value={formData.conseiller}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Nom du conseiller (optionnel)"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="inline mr-2" size={16} />
                    Objet du rendez-vous *
                  </label>
                  <textarea
                    name="objet"
                    value={formData.objet}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.objet ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez brièvement le motif de votre rendez-vous"
                  />
                  {errors.objet && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.objet}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-8"
              >
                {submitStatus === 'success' ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="text-green-600" size={40} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Rendez-vous confirmé !
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Votre rendez-vous a été enregistré avec succès.
                      <br />
                      Vous recevrez une confirmation par SMS.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-6 text-left">
                      <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Nom :</strong> {formData.prenom}</p>
                        <p><strong>Date :</strong> {new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                        <p><strong>Heure :</strong> {formData.heure}</p>
                        {formData.lieu && <p><strong>Lieu :</strong> {formData.lieu}</p>}
                        <p><strong>Objet :</strong> {formData.objet}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <AlertCircle className="text-red-600" size={40} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Erreur
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Une erreur est survenue lors de l'enregistrement.
                      <br />
                      Veuillez réessayer.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Retour
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={step === 1 ? handleNext : handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi...' : step === 2 ? 'Confirmer' : 'Suivant'}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentForm;