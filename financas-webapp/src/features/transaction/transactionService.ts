import api from "../../services/api";

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    id: number;
    amount: number;
    type: TransactionType;
    categoryId: number;
    categoryName: string;
    date: string;
    description?: string;
    tag?: string;
}

export interface CreateTransactionDto {
    amount: number;
    type: TransactionType;
    categoryId: number;
    date: string;
    description?: string;
    tag?: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

const transactionService = {
    create(data: CreateTransactionDto, token: string) {
        return api.post<Transaction, CreateTransactionDto>(
            '/transactions',
            data,
            token
        );
    },

    fetchAll(page: number, token: string) {
        return api.get<Page<Transaction>>(
            `/transactions?page=${page}&size=10&sort=date,desc`,
            token
        );
    },

};

export default transactionService;
