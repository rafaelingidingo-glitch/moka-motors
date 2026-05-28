'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  const scrollToInventory = () => {
    document.querySelector('#motorbikes')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-motorcycle.png"
          alt="Moka Motors - Premium Motorbikes"
          className="w-full h-full object-cover scale-105"
        />
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
        {/* Red accent glow */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#DC2626]/20 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#DC2626]/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-[#DC2626]/3 rounded-full blur-3xl z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] mb-6"
          >
            <span className="block">PREMIUM</span>
            <span className="block text-[#DC2626]">MOTORBIKES</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/90 mt-2">
              & SPARE PARTS
            </span>
            <span className="block text-lg md:text-xl lg:text-2xl text-gray-400 font-normal mt-4 tracking-wide">
              IN DAR ES SALAAM, TANZANIA
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
          >
            Your trusted destination for premium motorbikes and genuine spare parts.
            Located in Kariakoo, Dar es Salaam — we bring you the best rides at
            unbeatable prices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={scrollToInventory}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold px-8 py-4 rounded-sm text-base transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#DC2626]/25 hover:shadow-[#DC2626]/40 hover:-translate-y-0.5"
            >
              EXPLORE INVENTORY
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToContact}
              className="border-2 border-white/30 text-white hover:bg-white hover:text-[#111111] font-bold px-8 py-4 rounded-sm text-base transition-all duration-300 backdrop-blur-sm"
            >
              CONTACT US
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10"
          >
            <div>
              <p className="text-3xl font-black text-white">10+</p>
              <p className="text-gray-400 text-sm mt-1">Motorbikes</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-3xl font-black text-white">100+</p>
              <p className="text-gray-400 text-sm mt-1">Spare Parts</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-3xl font-black text-white">4</p>
              <p className="text-gray-400 text-sm mt-1">Top Brands</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/40 cursor-pointer hover:text-white/60 transition-colors"
          onClick={() =>
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </motion.div>

      {/* Side text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
        <p className="text-white/20 text-sm tracking-[0.3em] uppercase writing-mode-vertical"
          style={{ writingMode: 'vertical-rl' }}
        >
          MOKA MOTORS — EST. DAR ES SALAAM
        </p>
      </div>
    </section>
  )
}
