'use client'

import { motion } from 'framer-motion'
import { Wrench, ShieldCheck, HeadphonesIcon, BadgePercent, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function AboutSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Wrench,
      title: t('about.wideSelection'),
      desc: t('about.wideSelectionDesc'),
    },
    {
      icon: ShieldCheck,
      title: t('about.qualityParts'),
      desc: t('about.qualityPartsDesc'),
    },
    {
      icon: HeadphonesIcon,
      title: t('about.expertSupport'),
      desc: t('about.expertSupportDesc'),
    },
    {
      icon: BadgePercent,
      title: t('about.bestPrices'),
      desc: t('about.bestPricesDesc'),
    },
  ]
  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F5F5F5] skew-x-[-8deg] translate-x-1/4 hidden lg:block" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#DC2626]/5 rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-sm shadow-2xl">
              <img
                src="/images/about-shop.png"
                alt="Moka Motors Shop"
                className="w-full h-[400px] md:h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white font-black text-xl">Moka Motors</p>
                <p className="text-gray-300 text-sm mt-1">Kariakoo, Dar es Salaam</p>
              </div>
            </div>
            {/* Red accent block */}
            <div className="absolute -bottom-5 -right-5 w-36 h-36 bg-[#DC2626] -z-10 hidden md:block" />
            {/* Stats overlay card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-4 md:-left-8 bg-[#DC2626] text-white p-5 md:p-6 shadow-xl hidden md:block"
            >
              <p className="text-3xl md:text-4xl font-black">5+</p>
              <p className="text-white/80 text-sm mt-1">{t('about.yearsExperience')}<br/>{t('about.experience')}</p>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-[#DC2626]" />
              <p className="text-[#DC2626] font-bold text-sm uppercase tracking-[0.15em]">
                {t('about.tag')}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111111] mb-6 leading-tight">
              {t('about.heading1')}{' '}
              <span className="text-[#DC2626]">{t('about.headingHighlight')}</span> {t('about.heading2')}
            </h2>
            <p className="text-[#6B7280] text-base md:text-lg mb-4 leading-relaxed">
              {t('about.paragraph1')}
            </p>
            <p className="text-[#6B7280] text-base md:text-lg mb-8 leading-relaxed">
              {t('about.paragraph2')}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#F5F5F5] rounded-lg p-4 md:p-5 group hover:bg-[#111111] transition-all duration-300 cursor-default border border-transparent hover:border-[#DC2626]"
                >
                  <feature.icon className="h-8 w-8 text-[#DC2626] group-hover:text-[#DC2626] mb-3 transition-colors" />
                  <h3 className="font-bold text-sm md:text-base text-[#111111] group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#6B7280] group-hover:text-gray-400 text-xs md:text-sm mt-1 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
