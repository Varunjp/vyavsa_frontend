import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  ApiResponse,
  AttendanceRecord,
  Employee,
  EmployeeAdvanceRecord,
  EmployeeOvertimeRecord,
  EmployeeSalaryRecord,
  EmployeeSalaryStatementRecord,
} from '@/types';
import {
  CreateEmployeeInput,
  PaySalaryInput,
  RecordAdvanceInput,
  RecordAttendanceInput,
  RecordOvertimeInput,
} from '../schemas/employeeSchema';

export const employeeService = {
  // Employees
  async listEmployees(
    params: { page?: number; page_size?: number; search?: string; status?: string } = {}
  ): Promise<{ data: Employee[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Employee[]>>(API_ENDPOINTS.EMPLOYEES, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getEmployee(id: string): Promise<Employee> {
    const res = await apiClient.get<ApiResponse<Employee>>(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch employee');
    return res.data.data;
  },

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const res = await apiClient.post<ApiResponse<Employee>>(API_ENDPOINTS.EMPLOYEES, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create employee');
    return res.data.data;
  },

  async updateEmployee(id: string, input: Partial<CreateEmployeeInput>): Promise<Employee> {
    const res = await apiClient.put<ApiResponse<Employee>>(
      `${API_ENDPOINTS.EMPLOYEES}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update employee');
    return res.data.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
  },

  // Attendance
  async recordAttendance(input: RecordAttendanceInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE, input);
    return res.data.data;
  },

  async listAttendance(
    params: { page?: number; page_size?: number; date?: string; employee_id?: string } = {}
  ): Promise<{ data: AttendanceRecord[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>(API_ENDPOINTS.ATTENDANCE, {
      params,
    });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  // Overtime
  async recordOvertime(input: RecordOvertimeInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.OVERTIME, input);
    return res.data.data;
  },

  async listOvertime(
    params: { page?: number; page_size?: number; employee_id?: string } = {}
  ): Promise<{ data: EmployeeOvertimeRecord[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<EmployeeOvertimeRecord[]>>(API_ENDPOINTS.OVERTIME, {
      params,
    });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  // Advances
  async recordAdvance(input: RecordAdvanceInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.ADVANCES, input);
    return res.data.data;
  },

  async listAdvances(
    params: { page?: number; page_size?: number; employee_id?: string } = {}
  ): Promise<{ data: EmployeeAdvanceRecord[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<EmployeeAdvanceRecord[]>>(API_ENDPOINTS.ADVANCES, {
      params,
    });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  // Salaries & Payroll
  async listSalaries(
    params: { page?: number; page_size?: number } = {}
  ): Promise<{ data: EmployeeSalaryRecord[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<EmployeeSalaryRecord[]>>(API_ENDPOINTS.SALARIES, {
      params,
    });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async listPendingSalaries(): Promise<EmployeeSalaryRecord[]> {
    const res = await apiClient.get<ApiResponse<EmployeeSalaryRecord[]>>(
      API_ENDPOINTS.SALARIES_PENDING
    );
    return res.data.data || [];
  },

  async getSalaryStatement(employeeId: string): Promise<EmployeeSalaryStatementRecord> {
    const res = await apiClient.get<ApiResponse<EmployeeSalaryStatementRecord>>(
      `${API_ENDPOINTS.SALARIES}/${employeeId}/statement`
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch salary statement');
    return res.data.data;
  },

  async paySalary(employeeId: string, input: PaySalaryInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.SALARIES}/${employeeId}/pay`,
      input
    );
    return res.data.data;
  },
};
