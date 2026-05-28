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
  return `Hi Moka Motors! 👋\n\nI'm interested in purchasing this ${type} from Moka Motors:\n\n🚀 ${productName}\n💰 Price: TZS ${price.toLocaleString()}\n🏷️ Brand: ${brand}\n\nPlease let me know availability and next steps. Thank you!`
}

export function getCartCheckoutMessage(items: { name: string; price: number; quantity: number; brand: string }[]): string {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemLines = items
    .map((item) => `• ${item.name} (${item.brand}) x${item.quantity} - TZS ${(item.price * item.quantity).toLocaleString()}`)
    .join('\n')

  return `Hi Moka Motors! 👋\n\nI'd like to order the following items:\n\n${itemLines}\n\n💰 Total: TZS ${total.toLocaleString()}\n\nPlease confirm availability and delivery details. Thank you!`
}

export function getContactFormMessage(
  name: string,
  email: string,
  phone: string,
  message: string
): string {
  return `Hi Moka Motors! 👋\n\nNew Contact Form Submission:\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n\n💬 Message:\n${message}\n\nPlease get back to me. Thank you!`
}
