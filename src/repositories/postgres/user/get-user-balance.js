import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpense },
        } = await prisma.transaction.aggregate({
            where: {
                type: 'EXPENSE',
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
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalInvestment },
        } = await prisma.transaction.aggregate({
            where: {
                type: 'INVESTMENT',
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
