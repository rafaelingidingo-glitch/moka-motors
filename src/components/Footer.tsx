'use client'

import { Bike, Instagram, Facebook, MessageCircle, ArrowUp } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0A0A0A] pt-16 pb-8 relative">
      {/* Top red accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#DC2626]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1 - Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#DC2626] p-1.5 rounded-sm">
                <Bike className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-black text-xl tracking-wider">
                MOKA <span className="text-[#DC2626]">MOTORS</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Your trusted partner for premium motorbikes and genuine spare parts in
              Dar es Salaam, Tanzania. We are the solution for your problems. 😀
            </p>
            {/* Social Icons Row */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/moka_motor/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-[#DC2626] p-2.5 rounded-sm transition-all duration-300 group"
              >
                <Instagram className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="bg-white/5 hover:bg-[#DC2626] p-2.5 rounded-sm transition-all duration-300 group"
              >
                <Facebook className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://wa.me/255625260000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-green-600 p-2.5 rounded-sm transition-all duration-300 group"
              >
                <MessageCircle className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About Us', href: '#about' },
                { label: 'New Stock', href: '#new-stock' },
                { label: 'Motorbikes', href: '#motorbikes' },
                { label: 'Spare Parts', href: '#spare-parts' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      document
                        .querySelector(link.href)
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="text-gray-500 hover:text-[#DC2626] text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#DC2626] transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-5">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-500 text-sm flex items-start gap-2">
                <span className="text-[#DC2626] mt-0.5">▪</span>
                <div>
                  <span className="text-gray-300 font-semibold">Address:</span>
                  <br />Kariakoo, Dar es Salaam, Tanzania
                </div>
              </li>
              <li className="text-gray-500 text-sm flex items-start gap-2">
                <span className="text-[#DC2626] mt-0.5">▪</span>
                <div>
                  <span className="text-gray-300 font-semibold">Phone:</span>{' '}
                  <a
                    href="tel:+255625260000"
                    className="hover:text-[#DC2626] transition-colors"
                  >
                    +255 625 260000
                  </a>
                </div>
              </li>
              <li className="text-gray-500 text-sm flex items-start gap-2">
                <span className="text-[#DC2626] mt-0.5">▪</span>
                <div>
                  <span className="text-gray-300 font-semibold">Email:</span>{' '}
                  <a
                    href="mailto:info@mokamotors.co.tz"
                    className="hover:text-[#DC2626] transition-colors"
                  >
                    info@mokamotors.co.tz
                  </a>
                </div>
              </li>
              <li className="text-gray-500 text-sm flex items-start gap-2">
                <span className="text-[#DC2626] mt-0.5">▪</span>
                <div>
                  <span className="text-gray-300 font-semibold">Instagram:</span>{' '}
                  <a
                    href="https://www.instagram.com/moka_motor/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#DC2626] transition-colors"
                  >
                    @moka_motor
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4 - Brands */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-5">
              Brands We Carry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Honda', 'Kawasaki', 'KTM', 'Yamaha'].map((brand) => (
                <div
                  key={brand}
                  className="bg-white/5 rounded-sm px-3 py-2 text-center text-gray-400 text-sm font-semibold hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-all cursor-default"
                >
                  {brand}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <a
                href="https://www.instagram.com/moka_motor/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white font-bold px-5 py-2.5 rounded-sm text-sm hover:shadow-lg hover:shadow-[#DC2626]/20 transition-all"
              >
                <Instagram className="h-4 w-4" />
                Follow @moka_motor
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} Moka Motors. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-600 text-sm italic">
                We are the solution for your problems. 😀
              </p>
              <button
                onClick={scrollToTop}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white p-2 rounded-sm transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
