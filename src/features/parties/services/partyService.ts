import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  ApiResponse,
  ContraPreview,
  ContraSettlement,
  Party,
  PartyFinancialSummary,
} from '@/types';
import { CreateContraSettlementInput, CreatePartyInput } from '../schemas/partySchema';

export interface PartyListParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  status?: string;
}

export const partyService = {
  async listParties(params: PartyListParams = {}): Promise<{ data: Party[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Party[]>>(API_ENDPOINTS.PARTIES, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getParty(id: string): Promise<Party> {
    const res = await apiClient.get<ApiResponse<Party>>(`${API_ENDPOINTS.PARTIES}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch party');
    return res.data.data;
  },

  async createParty(input: CreatePartyInput): Promise<Party> {
    const res = await apiClient.post<ApiResponse<Party>>(API_ENDPOINTS.PARTIES, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create party');
    return res.data.data;
  },

  async updateParty(id: string, input: Partial<CreatePartyInput>): Promise<Party> {
    const res = await apiClient.put<ApiResponse<Party>>(`${API_ENDPOINTS.PARTIES}/${id}`, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update party');
    return res.data.data;
  },

  async deleteParty(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PARTIES}/${id}`);
  },

  async getPartyFinancialSummary(id: string): Promise<PartyFinancialSummary> {
    const res = await apiClient.get<ApiResponse<PartyFinancialSummary>>(
      `${API_ENDPOINTS.PARTIES}/${id}/financial-summary`
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch party summary');
    return res.data.data;
  },

  async getContraPreview(id: string): Promise<ContraPreview> {
    const res = await apiClient.get<ApiResponse<ContraPreview>>(
      `${API_ENDPOINTS.PARTIES}/${id}/contra-preview`
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch contra preview');
    return res.data.data;
  },

  async createContraSettlement(input: CreateContraSettlementInput): Promise<ContraSettlement> {
    const res = await apiClient.post<ApiResponse<ContraSettlement>>(
      API_ENDPOINTS.CONTRA_SETTLEMENTS,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to execute contra settlement');
    return res.data.data;
  },

  async listContraSettlements(
    params: { page?: number; page_size?: number } = {}
  ): Promise<{ data: ContraSettlement[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<ContraSettlement[]>>(
      API_ENDPOINTS.CONTRA_SETTLEMENTS,
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async cancelContraSettlement(id: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.CONTRA_SETTLEMENTS}/${id}/cancel`);
  },

  async getPartyLedger(id: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.PARTIES}/${id}/ledger`);
    return res.data.data;
  },
};
