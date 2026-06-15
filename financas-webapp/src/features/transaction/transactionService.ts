import api from "../../services/api";

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    id: number;
    amount: number;
    type: TransactionType;
    categoryId: number;
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

const transactionService = {
    create(data: CreateTransactionDto, token: string) {
        return api.post<Transaction, CreateTransactionDto>(
            '/transactions',
            data,
            token
        );
    },
};

export default transactionService;