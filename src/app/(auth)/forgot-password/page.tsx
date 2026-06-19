'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/modules/auth/schemas'
import { CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (_data: ForgotPasswordInput) => {
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    toast.success('E-mail enviado com instruções de recuperação')
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">E-mail enviado!</h1>
        <p className="text-muted-foreground">
          Verifique sua caixa de entrada para instruções de recuperação de senha.
        </p>
        <Link href="/login" className="text-primary hover:underline text-sm">
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar senha</h1>
        <p className="text-muted-foreground">
          Digite seu e-mail e enviaremos instruções para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Enviar instruções
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
