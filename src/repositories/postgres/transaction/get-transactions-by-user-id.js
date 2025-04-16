import { PosgresHelper } from "../../../db/postgres/helper";

export class PostgresGetTransactionsByUserId {
  async execute() {
    const transactions = await PosgresHelper.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [userId]
    );

    return transactions;
  }
}
