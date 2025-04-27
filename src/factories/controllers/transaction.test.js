import {
    CreateTransactionController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instace', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instace', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
})
