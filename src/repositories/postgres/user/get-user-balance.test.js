import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    date: faker.date.anytime().toISOString(),
                    type: TransactionType.EARNING,
                    user_id: user.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 5000,
                    date: faker.date.anytime().toISOString(),
                    type: TransactionType.EARNING,
                    user_id: user.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 1000,
                    date: faker.date.anytime().toISOString(),
                    type: TransactionType.EXPENSE,
                    user_id: user.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 1000,
                    date: faker.date.anytime().toISOString(),
                    type: TransactionType.EXPENSE,
                    user_id: user.id,
                },
                {
                    name: faker.commerce.productName(),
                    amount: 3000,
                    date: faker.date.anytime().toISOString(),
                    type: TransactionType.INVESTMENT,
                    user_id: user.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('3000')
        expect(result.balance.toString()).toBe('5000')
    })

    it('should return zeros when no transactions exists for the user', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('0')
        expect(result.expenses.toString()).toBe('0')
        expect(result.investments.toString()).toBe('0')
        expect(result.balance.toString()).toBe('0')
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserBalanceRepository()

        jest.spyOn(prisma.transaction, 'aggregate').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(fakeUser.id)

        expect(promise).rejects.toThrow()
    })
})
