import {
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Gift,
  HandCoins,
  HeartPulse,
  House,
  PawPrint,
  PiggyBank,
  Pill,
  ReceiptText,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICONS = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  pill: Pill,
  'book-open': BookOpen,
  'hand-coins': HandCoins,
  banknote: Banknote,
  'receipt-text': ReceiptText,
} satisfies Record<string, LucideIcon>

export type CategoryIcon = keyof typeof CATEGORY_ICONS
export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS) as CategoryIcon[]

export function getCategoryIcon(name: string | null | undefined): LucideIcon {
  return (name && (CATEGORY_ICONS as Record<string, LucideIcon>)[name]) || Tag
}

export const CATEGORY_COLORS = {
  green: { swatch: 'bg-green-base', bg: 'bg-green-light', text: 'text-green-dark', label: 'Verde' },
  blue: { swatch: 'bg-blue-base', bg: 'bg-blue-light', text: 'text-blue-dark', label: 'Azul' },
  purple: { swatch: 'bg-purple-base', bg: 'bg-purple-light', text: 'text-purple-dark', label: 'Roxo' },
  pink: { swatch: 'bg-pink-base', bg: 'bg-pink-light', text: 'text-pink-dark', label: 'Rosa' },
  red: { swatch: 'bg-red-base', bg: 'bg-red-light', text: 'text-red-dark', label: 'Vermelho' },
  orange: { swatch: 'bg-orange-base', bg: 'bg-orange-light', text: 'text-orange-dark', label: 'Laranja' },
  yellow: { swatch: 'bg-yellow-base', bg: 'bg-yellow-light', text: 'text-yellow-dark', label: 'Amarelo' },
} as const

export type CategoryColor = keyof typeof CATEGORY_COLORS
export const CATEGORY_COLOR_NAMES = Object.keys(CATEGORY_COLORS) as CategoryColor[]

const FALLBACK_COLOR = { swatch: 'bg-gray-400', bg: 'bg-gray-200', text: 'text-gray-700', label: 'Cinza' }

export function getCategoryColor(name: string | null | undefined) {
  return (name && (CATEGORY_COLORS as Record<string, typeof FALLBACK_COLOR>)[name]) || FALLBACK_COLOR
}
