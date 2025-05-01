import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { from, to, transaction, user } from '../../../tests/fixtures'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    it('should get transactions by user id on db', async () => {
        const date = '2025-01-02'

        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                date: new Date(date),
                user_id: user.id,
            },
        })

        const result = await sut.execute(user.id, from, to)

        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(result[0].user_id).toBe(user.id)
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month())
    })

    it('should call Prisma with correct params', async () => {
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany')
        const sut = new PostgresGetTransactionsByUserIdRepository()

        await sut.execute(user.id, from, to)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        expect(promise).rejects.toThrow()
    })
})
