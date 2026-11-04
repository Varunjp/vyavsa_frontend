'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AttendanceRecord, Employee, EmployeeSalaryRecord } from '@/types';
import { Plus, Search, CalendarCheck, Users, DollarSign, Edit, CheckCircle } from 'lucide-react';
import { CreateEmployeeModal } from './CreateEmployeeModal';
import { RecordAttendanceModal } from './RecordAttendanceModal';
import { PaySalaryModal } from './PaySalaryModal';

export function AttendancePayrollTab() {
  const [subTab, setSubTab] = useState<'employees' | 'attendance' | 'salaries'>('employees');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [activeSalaryRecord, setActiveSalaryRecord] = useState<EmployeeSalaryRecord | null>(null);

  // Queries
  const {
    data: employeesData,
    isLoading: employeesLoading,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => employeeService.listEmployees({ page, page_size: 15, search }),
    enabled: subTab === 'employees',
  });

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ['attendance', page],
    queryFn: () => employeeService.listAttendance({ page, page_size: 15 }),
    enabled: subTab === 'attendance',
  });

  const {
    data: salariesData,
    isLoading: salariesLoading,
    refetch: refetchSalaries,
  } = useQuery({
    queryKey: ['salaries', page],
    queryFn: () => employeeService.listSalaries({ page, page_size: 15 }),
    enabled: subTab === 'salaries',
  });

  const { data: allEmployees } = useQuery({
    queryKey: ['all-employees-lookup'],
    queryFn: () => employeeService.listEmployees({ page_size: 100 }),
  });

  const { data: banksData } = useQuery({
    queryKey: ['banks-lookup'],
    queryFn: () => cashBankService.listBanks(),
  });

  const employeeColumns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      render: e => (
        <div>
          <div className="fw-semibold text-dark">{e.name}</div>
          <span className="small text-muted">{e.phone || 'No phone'}</span>
        </div>
      ),
    },
    {
      key: 'salary',
      header: 'Base Salary',
      render: e => (
        <span className="font-mono text-dark fw-semibold">
          {e.salary ? formatCurrency(e.salary) : 'Daily Rate'}
        </span>
      ),
    },
    {
      key: 'ot_rate',
      header: 'OT Rate / Hr',
      render: e => <span className="font-mono text-muted">{formatCurrency(e.ot_rate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: e => (
        <span
          className={`badge ${
            e.status === 'active'
              ? 'bg-success-subtle text-success'
              : 'bg-secondary-subtle text-secondary'
          } small text-uppercase`}
        >
          {e.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: e => (
        <button
          className="btn btn-sm btn-outline-secondary p-1"
          onClick={() => {
            setEmployeeToEdit(e);
            setIsEmployeeModalOpen(true);
          }}
        >
          <Edit size={14} />
        </button>
      ),
    },
  ];

  const attendanceColumns: Column<AttendanceRecord>[] = [
    {
      key: 'date',
      header: 'Date',
      render: a => <span className="text-muted small">{formatDate(a.date)}</span>,
    },
    {
      key: 'employee',
      header: 'Staff Member',
      render: a => (
        <span className="fw-semibold text-dark">{a.employee_name || a.employee_id}</span>
      ),
    },
    {
      key: 'status',
      header: 'Attendance',
      render: a => {
        let badge = 'bg-secondary-subtle text-secondary';
        if (a.status === 'present') badge = 'bg-success-subtle text-success';
        if (a.status === 'absent') badge = 'bg-danger-subtle text-danger';
        if (a.status === 'half_day') badge = 'bg-warning-subtle text-warning-emphasis';
        return (
          <span className={`badge ${badge} small text-uppercase`}>
            {a.status.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'ot_amount',
      header: 'Overtime Paid',
      render: a => <span className="font-mono">{formatCurrency(a.ot_amount)}</span>,
    },
    {
      key: 'advance',
      header: 'Advance Paid',
      render: a => <span className="font-mono text-danger">{formatCurrency(a.advance)}</span>,
    },
  ];

  const salaryColumns: Column<EmployeeSalaryRecord>[] = [
    {
      key: 'employee',
      header: 'Staff Member',
      render: s => <span className="fw-semibold text-dark">{s.employee_name}</span>,
    },
    {
      key: 'gross',
      header: 'Gross Accrued',
      render: s => <span className="font-mono text-dark">{formatCurrency(s.gross_salary)}</span>,
    },
    {
      key: 'advances',
      header: 'Advances Deducted',
      render: s => (
        <span className="font-mono text-danger">{formatCurrency(s.total_advances)}</span>
      ),
    },
    {
      key: 'paid',
      header: 'Disbursed',
      render: s => <span className="font-mono text-success">{formatCurrency(s.total_paid)}</span>,
    },
    {
      key: 'balance',
      header: 'Pending Payable',
      render: s => {
        const bal = Number(s.balance || 0);
        return (
          <span className={`font-mono fw-bold ${bal > 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(bal)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: s => (
        <div>
          {Number(s.balance || 0) > 0 && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<DollarSign size={14} />}
              onClick={() => setActiveSalaryRecord(s)}
            >
              Pay
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Sub Tabs */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${subTab === 'employees' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('employees');
                setPage(1);
              }}
            >
              <Users size={16} className="me-1" /> Staff Directory
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${subTab === 'attendance' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('attendance');
                setPage(1);
              }}
            >
              <CalendarCheck size={16} className="me-1" /> Daily Attendance
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${subTab === 'salaries' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('salaries');
                setPage(1);
              }}
            >
              <DollarSign size={16} className="me-1" /> Salaries & Payroll
            </button>
          </li>
        </ul>

        <div className="d-flex gap-2">
          {subTab === 'employees' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setEmployeeToEdit(null);
                setIsEmployeeModalOpen(true);
              }}
            >
              Add Employee
            </Button>
          )}

          {subTab === 'attendance' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle size={16} />}
              onClick={() => setIsAttendanceModalOpen(true)}
            >
              Mark Attendance
            </Button>
          )}
        </div>
      </div>

      {subTab === 'employees' && (
        <>
          <div className="mb-3" style={{ maxWidth: '320px' }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <Search size={14} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search staff by name or phone..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <DataTable
            columns={employeeColumns}
            data={employeesData?.data || []}
            keyExtractor={e => e.id}
            isLoading={employeesLoading}
            emptyTitle="No Employees Registered"
            emptyDescription="Register shop staff, drivers, and counter salesmen to track payroll and daily shifts."
            emptyActionLabel="Add Employee"
            onEmptyAction={() => {
              setEmployeeToEdit(null);
              setIsEmployeeModalOpen(true);
            }}
          />
        </>
      )}

      {subTab === 'attendance' && (
        <DataTable
          columns={attendanceColumns}
          data={attendanceData?.data || []}
          keyExtractor={a => a.id}
          isLoading={attendanceLoading}
          emptyTitle="No Attendance Records Logged"
          emptyDescription="Daily check-ins, overtime, and salary advances will show up here."
          emptyActionLabel="Mark Attendance"
          onEmptyAction={() => setIsAttendanceModalOpen(true)}
        />
      )}

      {subTab === 'salaries' && (
        <DataTable
          columns={salaryColumns}
          data={salariesData?.data || []}
          keyExtractor={s => s.id}
          isLoading={salariesLoading}
          emptyTitle="No Payroll Statements Available"
          emptyDescription="Accrued wages, overtime earnings, and advance deductions appear here."
        />
      )}

      {/* Modals */}
      <CreateEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSuccess={() => refetchEmployees()}
        employeeToEdit={employeeToEdit}
      />

      <RecordAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSuccess={() => {
          refetchAttendance();
          refetchSalaries();
        }}
        employees={allEmployees?.data || []}
      />

      {activeSalaryRecord && (
        <PaySalaryModal
          isOpen={Boolean(activeSalaryRecord)}
          onClose={() => setActiveSalaryRecord(null)}
          onSuccess={() => refetchSalaries()}
          salaryRecord={activeSalaryRecord}
          banks={banksData || []}
        />
      )}
    </div>
  );
}
