import { Prisma, TransactionType } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        }
        const {
            _sum: { amount: totalExpense },
        } = await prisma.transaction.aggregate({
            where: {
                type: TransactionType.EXPENSE,
                ...dateFilter,
                user_id: userId,
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalEarning },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalInvestment },
        } = await prisma.transaction.aggregate({
            where: {
                type: TransactionType.INVESTMENT,
                ...dateFilter,
                user_id: userId,
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarning = totalEarning || new Prisma.Decimal(0)
        const _totalExpense = totalExpense || new Prisma.Decimal(0)
        const _totalInvestment = totalInvestment || new Prisma.Decimal(0)

        const balance = new Prisma.Decimal(
            _totalEarning - _totalExpense - _totalInvestment,
        )

        return {
            earnings: _totalEarning,
            expenses: _totalExpense,
            investments: _totalInvestment,
            balance,
        }
    }
}
