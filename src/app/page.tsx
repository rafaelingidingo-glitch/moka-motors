'use client'

import { useAdminStore } from '@/store/adminStore'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import NewStockSection from '@/components/NewStockSection'
import MotorbikeInventory from '@/components/MotorbikeInventory'
import SparePartsInventory from '@/components/SparePartsInventory'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import CartPanel from '@/components/CartPanel'
import AdminPage from '@/components/AdminPage'

export default function Home() {
  const { showAdminPage } = useAdminStore()

  if (showAdminPage) {
    return <AdminPage />
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <NewStockSection />
      <MotorbikeInventory />
      <SparePartsInventory />
      <ContactSection />
      <Footer />
      <CartPanel />
    </main>
  )
}
