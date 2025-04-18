import { badRequest, notFound } from './http.js'

export const invalidAmountResponse = () =>
    badRequest({ message: 'The amount must be a valid number' })

export const invalidTypeResponse = () =>
    badRequest({
        message: 'The type must be EARNING, EXPENSE or INVESTMENT',
    })

export const transactionNotFoundResponse = () =>
    notFound({
        message: 'Transaction not found',
    })
