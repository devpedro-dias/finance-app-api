import { CreateTransactionController } from '../../controllers'
import { makeCreateTransactionController } from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instace', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
