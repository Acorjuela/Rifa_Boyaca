export interface Ticket {
  id: number;
  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  whatsapp: string;
  numbers: number[];
  total_value: number;
  created_at: string;
  reference: string;
  payment_platform: 'nequi' | 'binance';
  ticket_code: string;
  is_approved: boolean;
  prize_type: 'cifras' | 'series';
}

export interface User {
  id: string;
  email?: string;
}

export interface PackageOption {
  id: number;
  label: string;
  price_cop: number;
  price_usd: number;
  numbers: number;
}

export interface PaymentPlatform {
  qr_url: string;
  enabled: boolean;
}

export interface RaffleInfo {
  title: string;
  description: string;
}

export interface WinningNumbers {
  cifras: string;
  series: string;
  cifrasTitle: string;
  seriesTitle: string;
}

export interface Prize {
  id: number;
  url: string | null;
  enabled: boolean;
}

export interface GradientColors {
  from: string;
  to: string;
}

export interface AppColors {
  home: GradientColors;
  reg: GradientColors;
  ticket: GradientColors;
}

export interface Settings {
  id: number;
  raffle_date: string;
  raffle_size: number;
  usd_to_cop_rate: number;
  raffle_info: RaffleInfo;
  payment_options: { nequi: PaymentPlatform; binance: PaymentPlatform };
  logo_url: string | null;
  winning_numbers: WinningNumbers;
  colors: AppColors;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  video_url: string | null;
  is_enabled: boolean;
  display_order: number;
  created_at: string;
}
