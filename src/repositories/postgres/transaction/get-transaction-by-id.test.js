import { prisma } from '../../../../prisma/prisma.js'
import { transaction } from '../../../tests/fixtures/transaction.js'
import { user } from '../../../tests/fixtures/user.js'
import { PostgresGetTransactionByIdRepository } from './get-transaction-by-id'

describe('PostgresGetTransactionByIdRepository', () => {
    const sut = new PostgresGetTransactionByIdRepository()

    it('should return the transaction when found', async () => {
        await prisma.user.create({ data: user })

        const createdTransaction = await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        const result = await sut.execute(createdTransaction.id)

        expect(result).not.toBeNull()
        expect(result.id).toBe(createdTransaction.id)
        expect(result.name).toBe(transaction.name)
        expect(String(result.amount)).toStrictEqual(String(transaction.amount))
    })
})
