import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Truck,
  ShoppingCart,
  Wallet,
  Users,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
  ArrowRightLeft,
  Lock,
  BarChart3,
} from 'lucide-react';
import { env } from '@/config/env';

export default function MarketingPage() {
  const features = [
    {
      icon: Truck,
      badge: 'Route & Van Sales',
      title: 'Line Sales & Field Distribution',
      description:
        'Dispatch goods across market routes, generate instant field invoices, capture split cash/UPI collections, and track salesman accountability.',
      accent: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      icon: ShoppingCart,
      badge: 'Retail Billing',
      title: 'High-Speed POS Counter Sales',
      description:
        'Bill walk-in retail customers in seconds with support for cash, direct bank/UPI transfers, split settlements, and customer khata credit.',
      accent: '#10b981',
      bg: '#ecfdf5',
    },
    {
      icon: ArrowRightLeft,
      badge: 'Signature Feature',
      title: 'Unified Parties & Contra Offset',
      description:
        'Manage entities who act as both customers and suppliers. Automatically offset mutual receivables and payables with a single verified contra entry.',
      accent: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      icon: Wallet,
      badge: 'Treasury Control',
      title: 'Cash Drawer & Bank Reconciliation',
      description:
        'Track physical drawer cash alongside multiple business bank accounts with strict adjustment audit trails and end-of-day tally verification.',
      accent: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      icon: Users,
      badge: 'HR & Shifts',
      title: 'Workforce Attendance & Payroll',
      description:
        'Log daily attendance, half-days, overtime hours, and cash salary advances—automatically computing net monthly payable wages.',
      accent: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      icon: BarChart3,
      badge: 'Audit Ready',
      title: 'Instant Financial & Closing Reports',
      description:
        'Generate daily cash settlement sheets, item-wise sales velocity, and printable PDF/Excel khata statements anytime.',
      accent: '#ec4899',
      bg: '#fdf2f8',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '₹ 499',
      period: '/month',
      description: 'Ideal for single-counter retail shops and local merchants.',
      features: [
        'Up to 2 Staff Operator Logins',
        'POS Counter Sales & PDF Receipts',
        'Physical Cash Drawer Governance',
        'Customer Khata & Due Reminders',
      ],
      isPopular: false,
    },
    {
      name: 'Growth',
      price: '₹ 999',
      period: '/month',
      description: 'Built for wholesale traders and distribution businesses with field routes.',
      features: [
        'Up to 10 Staff & Salesman Logins',
        'Field Line Sales & Route Tracking',
        'Customer Advances & Aging Ledger',
        'Unified Party Contra Settlements',
        'Daily Closing PDF & Excel Exports',
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: '₹ 1,999',
      period: '/month',
      description: 'Complete multi-bank treasury, workforce payroll, and priority support.',
      features: [
        'Unlimited Staff & RBAC Roles',
        'Multi-Bank Account Reconciliation',
        'Staff Attendance, OT & Payroll',
        'Custom Branded Invoice Footers',
        'Dedicated Priority Onboarding',
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      {/* Top Glassmorphic Navigation */}
      <nav
        className="navbar navbar-expand-lg sticky-top py-3"
        style={{
          backgroundColor: 'rgba(11, 17, 32, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container">
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center gap-2 fw-extrabold text-white"
          >
            <Image src="/images/logo.svg" alt="Vyavsa" width={34} height={34} priority />
            <span className="fs-5 tracking-tight">{env.NEXT_PUBLIC_APP_NAME}</span>
          </Link>

          <div className="d-none d-md-flex align-items-center gap-4 small">
            <a href="#features" className="text-decoration-none text-white opacity-75">
              Capabilities
            </a>
            <a href="#workflow" className="text-decoration-none text-white opacity-75">
              Why Vyavsa
            </a>
            <a href="#pricing" className="text-decoration-none text-white opacity-75">
              Pricing
            </a>
            <Link href="/platform/login" className="text-decoration-none text-white opacity-75">
              Platform Admin
            </Link>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              href="/login"
              className="btn btn-sm px-3 text-white border"
              style={{
                borderColor: 'rgba(255,255,255,0.22)',
                backgroundColor: 'rgba(255,255,255,0.06)',
              }}
            >
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm px-3">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Flagship Dark Fintech Hero Section */}
      <section className="marketing-hero-bg text-white py-5 position-relative overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill glass-pill mb-4">
                <Sparkles size={14} style={{ color: '#a5b4fc' }} />
                <span className="small fw-semibold" style={{ color: '#e0e7ff', fontSize: '0.78rem' }}>
                  2026 Enterprise Grade Bill Book &amp; Khata OS
                </span>
              </div>

              <h1
                className="display-5 fw-extrabold text-white mb-3"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.12 }}
              >
                Command Your Sales, Khata &amp; Cash Drawer in Real Time.
              </h1>

              <p className="lead mb-4" style={{ color: '#94a3b8', fontSize: '1.08rem' }}>
                Purpose-built for Indian wholesale distributors and retail counters. Replace
                disconnected spreadsheets and paper registers with automated line billing, instant
                contra settlements, multi-bank reconciliation, and staff payroll.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link
                  href="/register"
                  className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 px-4"
                >
                  <span>Create Business Workspace</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="btn btn-lg px-4 text-white border"
                  style={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  Sign In to Workspace
                </Link>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-4 pt-2 small" style={{ color: '#94a3b8' }}>
                <span className="d-inline-flex align-items-center gap-1.5">
                  <CheckCircle size={15} className="text-success" /> Instant PDF Invoices
                </span>
                <span className="d-inline-flex align-items-center gap-1.5">
                  <CheckCircle size={15} className="text-success" /> 1-Click Contra Offset
                </span>
                <span className="d-inline-flex align-items-center gap-1.5">
                  <Lock size={15} className="text-success" /> Role-Based Audit Trail
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="p-2 rounded-4 shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Image
                  src="/images/hero-illustration.svg"
                  alt="Vyavsa Business Dashboard Illustration"
                  width={620}
                  height={400}
                  className="img-fluid rounded-3 w-100 h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Operational Highlight Strip */}
          <div
            id="workflow"
            className="row g-3 mt-5 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            {[
              {
                metric: '100% Audit-Backed',
                label: 'Every cash drawer & passbook adjustment requires a logged reason',
              },
              {
                metric: 'Dual-Role Parties',
                label: 'Single ledger for entities who both buy from and supply to you',
              },
              {
                metric: 'Split Collections',
                label: 'Combine cash, bank/UPI, and customer advances on a single bill',
              },
              {
                metric: 'Scoped Staff RBAC',
                label: 'Dedicated permissions for Admin, Office, Salesmen, and Viewers',
              },
            ].map((item, idx) => (
              <div key={idx} className="col-sm-6 col-lg-3">
                <div
                  className="p-3 rounded-3 h-100"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="fw-bold text-white mb-1">{item.metric}</div>
                  <div className="small" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Capabilities Grid */}
      <section id="features" className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container py-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 640 }}>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 mb-2">
              UNIFIED OPERATING SYSTEM
            </span>
            <h2 className="fw-extrabold text-dark mb-2">
              Engineered for Indian Trade, Distribution &amp; Retail
            </h2>
            <p className="text-muted mb-0">
              Every module works in lockstep—when a salesman records a route collection, your
              customer khata, bank balance, and daily settlement sheet update automatically.
            </p>
          </div>

          <div className="row g-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="bento-card h-100 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-3"
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: f.bg,
                          color: f.accent,
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span
                        className="badge rounded-pill border"
                        style={{
                          backgroundColor: f.bg,
                          color: f.accent,
                          borderColor: 'transparent',
                          fontSize: '0.7rem',
                        }}
                      >
                        {f.badge}
                      </span>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{f.title}</h5>
                    <p className="text-muted small mb-0 flex-grow-1" style={{ lineHeight: 1.6 }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="pricing" className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 600 }}>
            <span className="badge bg-success-subtle text-success px-3 py-1.5 mb-2">
              TRANSPARENT SUBSCRIPTIONS
            </span>
            <h2 className="fw-extrabold text-dark mb-2">Simple, Predictable Pricing</h2>
            <p className="text-muted mb-0">
              Zero setup fees. Upgrade your workspace tier anytime as your distribution lines grow.
            </p>
          </div>

          <div className="row g-4 justify-content-center align-items-stretch">
            {plans.map((p, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div
                  className="h-100 p-4 rounded-4 d-flex flex-column position-relative"
                  style={{
                    backgroundColor: p.isPopular ? '#0f172a' : '#ffffff',
                    color: p.isPopular ? '#ffffff' : '#0f172a',
                    border: p.isPopular ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    boxShadow: p.isPopular ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  }}
                >
                  {p.isPopular && (
                    <span
                      className="position-absolute top-0 start-50 translate-middle badge px-3 py-1.5 text-uppercase"
                      style={{
                        background: 'var(--gradient-primary)',
                        color: '#ffffff',
                        fontSize: '0.6875rem',
                      }}
                    >
                      Most Popular Tier
                    </span>
                  )}

                  <div className="mb-3">
                    <h5 className={`fw-bold mb-1 ${p.isPopular ? 'text-white' : 'text-dark'}`}>
                      {p.name}
                    </h5>
                    <p
                      className="small mb-3"
                      style={{ color: p.isPopular ? '#94a3b8' : '#64748b' }}
                    >
                      {p.description}
                    </p>
                    <div className="d-flex align-items-baseline gap-1">
                      <span
                        className={`display-6 fw-extrabold font-mono ${p.isPopular ? 'text-white' : 'text-dark'}`}
                      >
                        {p.price}
                      </span>
                      <span
                        className="small"
                        style={{ color: p.isPopular ? '#94a3b8' : '#64748b' }}
                      >
                        {p.period}
                      </span>
                    </div>
                  </div>

                  <hr className="my-3" style={{ opacity: p.isPopular ? 0.15 : 0.1 }} />

                  <ul className="list-unstyled d-flex flex-column gap-2.5 mb-4 flex-grow-1">
                    {p.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="d-flex align-items-center gap-2 small"
                        style={{ color: p.isPopular ? '#e2e8f0' : '#334155' }}
                      >
                        <CheckCircle size={16} className="text-success flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/register?plan=${p.name.toLowerCase()}`}
                    className={`btn mt-auto w-100 ${p.isPopular ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    Select {p.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-light border-top mt-auto">
        <div className="container">
          <div className="row gy-4 align-items-center justify-content-between">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-2">
                <Image src="/images/logo.svg" alt="Vyavsa" width={26} height={26} />
                <span>{env.NEXT_PUBLIC_APP_NAME}</span>
              </div>
              <p className="text-muted small mb-0">
                &copy; {new Date().getFullYear()} Vyavsa SaaS. All rights reserved. Built for
                modern Indian commerce.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap gap-3 justify-content-md-end small text-muted">
                <span className="d-inline-flex align-items-center gap-1">
                  <Mail size={14} /> {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <Phone size={14} /> +91 {env.NEXT_PUBLIC_SUPPORT_PHONE}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
