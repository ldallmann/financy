import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/contexts/auth'
import { REGISTER } from '@/graphql/mutations'
import { getErrorMessage, getFieldErrors } from '@/lib/apollo'
import { AuthDivider, AuthHeader } from './auth-shared'

const schema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo'),
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [registerUser, { loading }] = useMutation(REGISTER)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { data } = await registerUser({ variables: values })
      if (!data) return
      await signIn(data.register.token, data.register.user, true)
      toast.success('Conta criada com sucesso!')
      navigate('/', { replace: true })
    } catch (error) {
      const fields = getFieldErrors(error)
      if (fields.email) setError('email', { message: fields.email })
      else toast.error(getErrorMessage(error, 'Não foi possível criar a conta'))
    }
  })

  return (
    <div className="flex flex-col gap-8">
      <AuthHeader title="Criar conta" subtitle="Comece a controlar suas finanças ainda hoje" />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            autoComplete="name"
            placeholder="Seu nome completo"
            icon={UserRound}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="mail@exemplo.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordInput
            label="Senha"
            autoComplete="new-password"
            placeholder="Digite sua senha"
            helper="A senha deve ter no mínimo 8 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Cadastrar
        </Button>

        <AuthDivider />

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-gray-600">Já tem uma conta?</p>
          <Button variant="outline" fullWidth icon={LogIn} onClick={() => navigate('/')}>
            Fazer login
          </Button>
        </div>
      </form>
    </div>
  )
}
