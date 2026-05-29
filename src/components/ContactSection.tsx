'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react'
import { getContactFormMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n'

export default function ContactSection() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const whatsappUrl = getWhatsAppUrl(
      getContactFormMessage(formData.name, formData.email, formData.phone, formData.message)
    )
    window.open(whatsappUrl, '_blank')
    toast.success(t('contact.whatsappToast'))
  }

  return (
    <section id="contact" className="py-12 md:py-20 lg:py-28 bg-[#111111] relative overflow-hidden">
      {/* Background decorative */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1A1A1A] skew-x-[-6deg] translate-x-1/4 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-[#DC2626]" />
            <p className="text-[#DC2626] font-bold text-sm uppercase tracking-[0.15em]">
              {t('contact.tag')}
            </p>
            <div className="w-8 h-[2px] bg-[#DC2626]" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white">
            {t('contact.heading1')} <span className="text-[#DC2626]">{t('contact.heading2')}</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#1A1A1A] rounded-sm p-6 md:p-8 border border-gray-800">
              <h3 className="text-xl font-black text-white mb-6">
                {t('contact.sendMessage')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {t('contact.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {t('contact.emailAddress')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {t('contact.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                      placeholder={t('contact.phonePlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#DC2626]/20 hover:shadow-[#DC2626]/30"
                >
                  {t('contact.submit')}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="bg-[#1A1A1A] rounded-sm p-6 md:p-8 border border-gray-800">
              <h3 className="text-xl font-black text-white mb-6">
                {t('contact.visitShop')}
              </h3>
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: t('contact.address'),
                    value: 'Kariakoo, Dar es Salaam, Tanzania',
                    href: 'https://maps.google.com/?q=Kariakoo+Dar+es+Salaam+Tanzania',
                  },
                  {
                    icon: Phone,
                    label: t('contact.phone'),
                    value: '+255 625 260000',
                    href: 'tel:+255625260000',
                  },
                  {
                    icon: Mail,
                    label: t('contact.email'),
                    value: 'info@mokamotors.co.tz',
                    href: 'mailto:info@mokamotors.co.tz',
                  },
                  {
                    icon: Instagram,
                    label: t('contact.instagram'),
                    value: '@moka_motor',
                    href: 'https://www.instagram.com/moka_motor/',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="bg-[#DC2626]/10 p-3 rounded-sm shrink-0">
                      <item.icon className="h-5 w-5 text-[#DC2626]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-300 text-sm">{item.label}</p>
                      <a
                        href={item.href}
                        target={item.icon === MapPin || item.icon === Instagram ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-white text-sm mt-0.5 hover:text-[#DC2626] transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-600 rounded-sm p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/30 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  {/* <MessageCircle className="h-7 w-7" /> */}
                  <h3 className="text-xl font-black">{t('contact.whatsappUs')}</h3>
                </div>
                <p className="text-green-100 text-sm mb-4">
                  {t('contact.whatsappDesc')}
                </p>
                <a
                  href={getWhatsAppUrl(
                    "Hi Moka Motors! 👋 I'd like to inquire about your products. Thank you!"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-sm hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t('contact.chatWhatsApp')}
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#1A1A1A] rounded-sm overflow-hidden border border-gray-800">
              <div className="bg-[#1A1A1A] h-48 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#111111]" />
                <div className="relative text-center">
                  <MapPin className="h-10 w-10 text-[#DC2626] mx-auto mb-3" />
                  <p className="text-white font-bold text-lg">
                    Kariakoo, Dar es Salaam
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Tanzania</p>
                  <a
                    href="https://maps.google.com/?q=Kariakoo+Dar+es+Salaam+Tanzania"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DC2626] text-sm font-bold hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    {t('contact.openMaps')}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
