import { prisma } from '../../../../prisma/prisma'
import { PostgresCreateTransactionRepository } from './create-transaction'
import { user, transaction } from '../../../tests/fixtures'
import dayjs from 'dayjs'

describe('PostgresCreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        await prisma.user.create({ data: user })

        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({
            ...transaction,
            user_id: user.id,
        })

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'create')
        const sut = new PostgresCreateTransactionRepository()

        await sut.execute({ ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        expect(promise).rejects.toThrow()
    })
})
