import api from "../../services/api";

export interface SpendingLimit {
    id: number;
    limitAmount: number;
    categoryId: number;
    categoryName: string;
}

export interface CreateSpendingLimitDto {
    limitAmount: number;
    categoryId: number;
}

const spendingLimitService = {
    fetchAll(token: string) {
        return api.get<SpendingLimit[]>('/spending-limits', token);
    },

    create(data: CreateSpendingLimitDto, token: string) {
        return api.post<SpendingLimit, CreateSpendingLimitDto>('/spending-limits', data, token);
    },

    remove(id: number, token: string) {
        return api.delete<void>(`/spending-limits/${id}`, token);
    },
};

export default spendingLimitService;
