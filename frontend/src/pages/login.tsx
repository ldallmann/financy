import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, UserRoundPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/contexts/auth'
import { LOGIN } from '@/graphql/mutations'
import { getErrorMessage } from '@/lib/apollo'
import { AuthDivider, AuthHeader } from './auth-shared'

const schema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
  remember: z.boolean(),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [login, { loading }] = useMutation(LOGIN)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = handleSubmit(async ({ email, password, remember }) => {
    try {
      const { data } = await login({ variables: { email, password } })
      if (!data) return
      await signIn(data.login.token, data.login.user, remember)
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível entrar'))
    }
  })

  return (
    <div className="flex flex-col gap-8">
      <AuthHeader title="Fazer login" subtitle="Entre na sua conta para continuar" />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
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
            autoComplete="current-password"
            placeholder="Digite sua senha"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex items-center justify-between">
            <Checkbox label="Lembrar-me" {...register('remember')} />
            <button
              type="button"
              className="cursor-pointer text-sm font-medium text-brand-base hover:underline"
              onClick={() => toast.info('A recuperação de senha ainda não está disponível.')}
            >
              Recuperar senha
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Entrar
        </Button>

        <AuthDivider />

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-gray-600">Ainda não tem uma conta?</p>
          <Button variant="outline" fullWidth icon={UserRoundPlus} onClick={() => navigate('/cadastro')}>
            Criar conta
          </Button>
        </div>
      </form>
    </div>
  )
}
