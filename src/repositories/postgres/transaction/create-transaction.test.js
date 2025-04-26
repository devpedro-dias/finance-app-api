import { prisma } from '../../../../prisma/prisma'
import { PostgresCreateTransactionRepository } from './create-transaction'
import { user as fakeUser, transaction } from '../../../tests/fixtures'
import dayjs from 'dayjs'

describe('PostgresCreateTransactionRepositoy', () => {
    it('should create a transaction on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

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
})
