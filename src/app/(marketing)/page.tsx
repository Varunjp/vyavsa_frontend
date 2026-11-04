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
} from 'lucide-react';
import { env } from '@/config/env';

export default function MarketingPage() {
  const features = [
    {
      icon: Truck,
      title: 'Line Sales & Field Distribution',
      description:
        'Deliver goods on the route, record real-time invoices, capture partial collections, and track operator ownership.',
    },
    {
      icon: ShoppingCart,
      title: 'POS Counter Sales',
      description:
        'High-speed retail counter billing supporting split payments across cash, multiple banks, and customer advances.',
    },
    {
      icon: Wallet,
      title: 'Cash Drawer & Bank Reconciliation',
      description:
        'Physical cash drawer balance tracking with strict adjustment audit trails and multi-bank ledger sync.',
    },
    {
      icon: Users,
      title: 'Workforce & Daily Payroll',
      description:
        'Log employee attendance, overtime, salary advances, and disburse computed monthly payroll with zero fuss.',
    },
    {
      icon: ShieldCheck,
      title: 'Unified Parties & Contra Settlements',
      description:
        'Seamlessly manage entities who are both customers and suppliers. Offset mutual balances in one click.',
    },
    {
      icon: CheckCircle,
      title: 'Instant Financial Statements',
      description:
        'Export daily closing reports, sales velocity by item, and customer dues statements to PDF and Excel.',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '₹ 499',
      period: '/month',
      description: 'Ideal for single-counter retail shops and small traders.',
      features: [
        'Up to 2 Staff Users',
        'Counter Sales & Invoicing',
        'Cash Drawer Tracking',
        'PDF Receipts',
      ],
      isPopular: false,
    },
    {
      name: 'Growth',
      price: '₹ 999',
      period: '/month',
      description: 'Built for active distribution businesses with field lines.',
      features: [
        'Up to 10 Staff Users',
        'Line Sales & Route Tracking',
        'Customer Advances & Aging',
        'Unified Contra Settlements',
        'Daily Report Exports',
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: '₹ 1,999',
      period: '/month',
      description: 'Comprehensive solution with multi-bank reconciliation and payroll.',
      features: [
        'Unlimited Staff Users',
        'Multi-Bank Account Sync',
        'Employee Attendance & Payroll',
        'Priority Phone Support',
        'Custom Invoice Footers',
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark">
            <Image src="/images/logo.svg" alt="Vyavsa" width={32} height={32} priority />
            <span className="fs-5">{env.NEXT_PUBLIC_APP_NAME}</span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <Link href="/login" className="btn btn-outline-primary btn-sm px-3">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm px-3">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 bg-light border-bottom position-relative overflow-hidden">
        <div className="container py-lg-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
                Modern 2026 SaaS Bill Book
              </span>
              <h1 className="display-5 fw-extrabold text-dark tracking-tight mb-3">
                Financial Clarity & Smart Billing for Growing Businesses
              </h1>
              <p className="lead text-muted mb-4">
                Vyavsa replaces error-prone paper khata books with automated counter sales, route
                distribution, contra settlements, cash reconciliation, and staff payroll.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 px-4 shadow-sm"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn btn-outline-secondary btn-lg px-4">
                  Log In to Workspace
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-3 bg-white rounded-4 shadow-sm border">
                <Image
                  src="/images/hero-illustration.svg"
                  alt="Vyavsa Business Dashboard Illustration"
                  width={520}
                  height={340}
                  className="img-fluid"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="fw-bold text-dark mb-2">Designed for Indian Trade & Distribution</h2>
            <p className="text-muted">
              Everything your business needs from invoice generation to mutual party settlement.
            </p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card h-100 p-4 border border-light-subtle rounded-3 shadow-xs hover-shadow transition-shadow">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary mb-3"
                      style={{ width: 48, height: 48 }}
                    >
                      <Icon size={24} />
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{f.title}</h5>
                    <p className="text-muted small mb-0">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-5 bg-light border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Simple, Transparent Pricing</h2>
            <p className="text-muted">No hidden setup fees. Upgrade or cancel anytime.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {plans.map((p, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div
                  className={`card h-100 p-4 rounded-3 shadow-sm border ${
                    p.isPopular
                      ? 'border-primary border-2 position-relative'
                      : 'border-light-subtle'
                  }`}
                >
                  {p.isPopular && (
                    <span
                      className="position-absolute top-0 start-50 translate-middle badge bg-primary px-3 py-1 text-uppercase"
                      style={{ fontSize: '0.6875rem' }}
                    >
                      Most Popular
                    </span>
                  )}
                  <div className="mb-3">
                    <h5 className="fw-bold text-dark mb-1">{p.name}</h5>
                    <p className="text-muted small mb-3">{p.description}</p>
                    <div className="d-flex align-items-baseline gap-1">
                      <span className="display-6 fw-bold text-dark font-mono">{p.price}</span>
                      <span className="text-muted small">{p.period}</span>
                    </div>
                  </div>
                  <hr className="my-3 opacity-25" />
                  <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                    {p.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="d-flex align-items-center gap-2 small text-secondary"
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
      <footer className="py-5 bg-white border-top mt-auto">
        <div className="container">
          <div className="row gy-4 align-items-center justify-content-between">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-2">
                <Image src="/images/logo.svg" alt="Vyavsa" width={24} height={24} />
                <span>{env.NEXT_PUBLIC_APP_NAME}</span>
              </div>
              <p className="text-muted small mb-0">
                &copy; {new Date().getFullYear()} Vyavsa SaaS. All rights reserved. Built for small
                businesses.
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
