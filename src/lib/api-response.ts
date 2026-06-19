import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { createLogger } from './logger'

const logger = createLogger('api')

export interface ApiSuccess<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: unknown
}

export function ok<T>(data: T, message?: string, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data, message }, { status })
}

export function created<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  return ok(data, message, 201)
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

export function badRequest(message: string, details?: unknown): NextResponse<ApiError> {
  return NextResponse.json({ error: message, details }, { status: 400 })
}

export function unauthorized(message = 'Não autorizado'): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = 'Acesso negado'): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message = 'Não encontrado'): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function conflict(message: string): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function internalError(error: unknown): NextResponse<ApiError> {
  logger.error(error, 'Internal server error')
  return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return badRequest('Dados inválidos', error.flatten().fieldErrors)
  }
  if (error instanceof Error) {
    if (error.message.includes('Unique constraint')) {
      return conflict('Registro já existe')
    }
    if (error.message.includes('not found')) {
      return notFound(error.message)
    }
  }
  return internalError(error)
}
