import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
    async delete(transactionId) {
        const transaction = await PostgresHelper.query(
            `
            SELECT * FROM transactions 
            WHERE id = $1
            RETURNING *
            `,
            [transactionId],
        )

        return transaction
    }
}
