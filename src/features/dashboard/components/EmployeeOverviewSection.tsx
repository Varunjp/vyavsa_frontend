'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { TodayOverview } from '@/types';
import { Users, CheckCircle2, XCircle, ArrowUpRight, Coffee } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/features/employees/services/employeeService';
import { getTodayDateString } from '@/lib/utils';

export interface EmployeeOverviewSectionProps {
  todayOverview?: TodayOverview;
  isLoading: boolean;
  date?: string;
}

export function EmployeeOverviewSection({
  todayOverview,
  isLoading,
  date,
}: EmployeeOverviewSectionProps) {
  const effectiveDate = date || todayOverview?.date || getTodayDateString();

  // Fetch today's actual attendance records to break down present, absent, half_day, leave
  const { data: attendanceData } = useQuery({
    queryKey: ['today-attendance-overview-records', effectiveDate],
    queryFn: () => employeeService.listAttendance({ date: effectiveDate, page_size: 100 }),
  });

  const records = attendanceData?.data || [];

  // Determine counts
  let presentCount = todayOverview?.attendance?.present ?? 0;
  let absentCount = todayOverview?.attendance?.absent ?? 0;
  let leaveCount = 0;
  let halfDayCount = 0;
  let totalStaff = todayOverview?.attendance?.total ?? 0;

  if (records.length > 0) {
    let p = 0;
    let a = 0;
    let l = 0;
    let h = 0;
    for (const r of records) {
      const status = (r.status || '').toLowerCase();
      if (status === 'present') p++;
      else if (status === 'absent') a++;
      else if (status === 'leave' || status === 'on_leave') l++;
      else if (status === 'half_day') h++;
      else p++;
    }
    presentCount = p;
    absentCount = a;
    leaveCount = l;
    halfDayCount = h;
    if (totalStaff < records.length) {
      totalStaff = records.length;
    }
  }

  // Calculate attendance percentage
  const effectiveTotal = Math.max(
    totalStaff,
    presentCount + absentCount + leaveCount + halfDayCount
  );
  const attendancePercentage =
    effectiveTotal > 0 ? Math.round((presentCount / effectiveTotal) * 100) : 0;

  const getStatusColor = (pct: number) => {
    if (pct >= 80)
      return {
        stroke: '#10b981',
        text: 'text-success',
        bg: 'bg-success-subtle',
        label: 'Optimal Turnout',
      };
    if (pct >= 50)
      return {
        stroke: '#f59e0b',
        text: 'text-warning',
        bg: 'bg-warning-subtle',
        label: 'Moderate Turnout',
      };
    return { stroke: '#ef4444', text: 'text-danger', bg: 'bg-danger-subtle', label: 'Low Turnout' };
  };

  const status = getStatusColor(attendancePercentage);

  return (
    <Card
      title={
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 32, height: 32, backgroundColor: '#f0f9ff', color: '#0ea5e9' }}
          >
            <Users size={16} />
          </div>
          <div>
            <span className="fw-bold text-dark">Workforce &amp; Staff Attendance</span>
          </div>
        </div>
      }
      subtitle={`Live shift turnout, daily presence, and attendance health for ${effectiveDate}`}
      className="mb-4"
      actions={
        <Link
          href="/dashboard?tab=attendance"
          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5"
        >
          <span>View Detailed Records</span>
          <ArrowUpRight size={14} />
        </Link>
      }
    >
      {isLoading ? (
        <div className="row g-3 placeholder-glow">
          <div className="col-lg-8">
            <div className="row g-2">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="col-6 col-sm-3">
                  <div className="p-3 rounded-3 border bg-light">
                    <span className="placeholder col-6 rounded py-1 d-block mb-2"></span>
                    <span className="placeholder col-8 fs-4 rounded d-block"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 rounded-3 border bg-light h-100">
              <span className="placeholder col-8 rounded py-3 d-block mx-auto"></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-3 align-items-stretch">
          {/* Left Column: Stat Cards */}
          <div className="col-lg-8">
            <div className="row g-2 mb-3">
              {/* Total Employees */}
              <div className="col-6 col-sm-3">
                <div className="p-3 rounded-3 border bg-light h-100">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span
                      className="text-muted fw-bold text-uppercase"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
                    >
                      Total Staff
                    </span>
                    <Users size={15} className="text-secondary" />
                  </div>
                  <h4 className="fw-extrabold font-mono text-dark mb-0 fs-4">{effectiveTotal}</h4>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Active workforce
                  </span>
                </div>
              </div>

              {/* Present Today */}
              <div className="col-6 col-sm-3">
                <div
                  className="p-3 rounded-3 border h-100 bg-white"
                  style={{ borderLeft: '3px solid #10b981' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span
                      className="text-muted fw-bold text-uppercase"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
                    >
                      Present
                    </span>
                    <CheckCircle2 size={15} className="text-success" />
                  </div>
                  <h4 className="fw-extrabold font-mono text-success mb-0 fs-4">{presentCount}</h4>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    On shift today
                  </span>
                </div>
              </div>

              {/* Absent Today */}
              <div className="col-6 col-sm-3">
                <div
                  className="p-3 rounded-3 border h-100 bg-white"
                  style={{ borderLeft: '3px solid #ef4444' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span
                      className="text-muted fw-bold text-uppercase"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
                    >
                      Absent
                    </span>
                    <XCircle size={15} className="text-danger" />
                  </div>
                  <h4 className="fw-extrabold font-mono text-danger mb-0 fs-4">{absentCount}</h4>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Unreported/absent
                  </span>
                </div>
              </div>

              {/* On-Leave / Half-Day */}
              <div className="col-6 col-sm-3">
                <div
                  className="p-3 rounded-3 border h-100 bg-white"
                  style={{ borderLeft: '3px solid #f59e0b' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span
                      className="text-muted fw-bold text-uppercase"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
                    >
                      On Leave
                    </span>
                    <Coffee size={15} className="text-warning" />
                  </div>
                  <h4 className="fw-extrabold font-mono text-warning mb-0 fs-4">
                    {leaveCount + halfDayCount}
                  </h4>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {halfDayCount > 0
                      ? `${leaveCount} leave · ${halfDayCount} half-day`
                      : 'Approved leaves'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation bar */}
            <div className="p-2.5 rounded-3 border bg-light d-flex flex-wrap align-items-center justify-content-between gap-2">
              <span className="text-muted small">
                Attendance directly affects daily wages, overtime, and monthly payroll.
              </span>
              <Link
                href="/dashboard?tab=attendance"
                className="btn btn-sm btn-link text-primary text-decoration-none p-0 fw-semibold d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                <span>Record Today&apos;s Attendance</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column: Attendance Percentage Visualization */}
          <div className="col-lg-4">
            <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-center align-items-center text-center">
              <span
                className="text-muted fw-bold text-uppercase mb-2"
                style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                Shift Attendance Rate
              </span>

              {/* Circular visualization or sleek progress meter */}
              <div className="position-relative d-inline-flex align-items-center justify-content-center my-2">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="transform -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={status.stroke}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - attendancePercentage / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="position-absolute text-center">
                  <span className="fw-extrabold font-mono text-dark d-block fs-4">
                    {attendancePercentage}%
                  </span>
                </div>
              </div>

              <div className="mt-1">
                <span
                  className={`badge rounded-pill ${status.bg} ${status.text} fw-semibold px-2.5 py-1`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {status.label}
                </span>
                <div className="text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
                  {presentCount} of {effectiveTotal} employees present
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
