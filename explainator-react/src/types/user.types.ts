/**
 * Type definitions for user authentication and subscription
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeId?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing';

export interface SubscriptionLimits {
  maxTemplates: number;
  maxProjects: number;
  canvasMode: boolean;
  exportPNG: boolean;
  exportExcel: boolean;
  exportStandaloneHTML: boolean;
  slides: boolean;
  connectors: boolean;
  collaboration: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    maxTemplates: 5,
    maxProjects: 2,
    canvasMode: false,
    exportPNG: true,
    exportExcel: false,
    exportStandaloneHTML: false,
    slides: false,
    connectors: false,
    collaboration: false,
  },
  pro: {
    maxTemplates: 50,
    maxProjects: 20,
    canvasMode: true,
    exportPNG: true,
    exportExcel: true,
    exportStandaloneHTML: true,
    slides: true,
    connectors: true,
    collaboration: false,
  },
  enterprise: {
    maxTemplates: Infinity,
    maxProjects: Infinity,
    canvasMode: true,
    exportPNG: true,
    exportExcel: true,
    exportStandaloneHTML: true,
    slides: true,
    connectors: true,
    collaboration: true,
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TemplateData {
  id: string;
  userId: string;
  name: string;
  data: any; // LayoutData JSON
  thumbnail?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
