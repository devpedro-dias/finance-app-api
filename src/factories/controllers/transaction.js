import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionByIdRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'
import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import { UuidGeneratorAdapter } from '../../adapters/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const uuidGeneratorAdapter = new UuidGeneratorAdapter()

    const createTransactionUseCase = new CreateTransactionUseCase(
        getUserByIdRepository,
        createTransactionRepository,
        uuidGeneratorAdapter,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransactionsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
    )
    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)

    return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
        getTransactionByIdRepository,
    )
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updateTransactionController
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()
    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
    )
    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )

    return deleteTransactionController
}
