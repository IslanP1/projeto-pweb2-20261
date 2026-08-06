import api from "../../services/api";

export interface Goal {
    id: number;
    name: string;
    targetAmount: number;
    startDate: string;
    deadline: string;
    categoryId?: number;
    categoryName?: string;
}

export interface CreateGoalDto {
    name: string;
    targetAmount: number;
    deadline: string;
    startDate?: string;
    categoryId?: number;
}

const goalService = {
    fetchAll(token: string) {
        return api.get<Goal[]>('/goals', token);
    },

    create(data: CreateGoalDto, token: string) {
        return api.post<Goal, CreateGoalDto>('/goals', data, token);
    },
};

export default goalService;
