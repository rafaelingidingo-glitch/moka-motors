import { t } from '@/lib/i18n'

const WHATSAPP_NUMBER = '255625260000'

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function getProductInquiryMessage(
  productName: string,
  price: number,
  brand: string,
  type: 'motorbike' | 'spare-part'
): string {
  return `${t('whatsapp.greeting')}\n\n${t('whatsapp.inquiryIntro', { type })}\n\n🚀 ${productName}\n💰 ${t('whatsapp.price')} TZS ${price.toLocaleString()}\n🏷️ ${t('whatsapp.brand')} ${brand}\n\n${t('whatsapp.inquiryClosing')}`
}

export function getCartCheckoutMessage(items: { name: string; price: number; quantity: number; brand: string }[]): string {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemLines = items
    .map((item) => `• ${item.name} (${item.brand}) x${item.quantity} - TZS ${(item.price * item.quantity).toLocaleString()}`)
    .join('\n')

  return `${t('whatsapp.greeting')}\n\n${t('whatsapp.cartIntro')}\n\n${itemLines}\n\n💰 ${t('whatsapp.total')} TZS ${total.toLocaleString()}\n\n${t('whatsapp.cartClosing')}`
}

export function getContactFormMessage(
  name: string,
  email: string,
  phone: string,
  message: string
): string {
  return `${t('whatsapp.greeting')}\n\n${t('whatsapp.contactIntro')}\n\n👤 ${t('whatsapp.name')} ${name}\n📧 ${t('whatsapp.email')} ${email}\n📱 ${t('whatsapp.phone')} ${phone}\n\n💬 ${t('whatsapp.message')}\n${message}\n\n${t('whatsapp.contactClosing')}`
}
