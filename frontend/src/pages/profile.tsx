import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'
import { UPDATE_PROFILE } from '@/graphql/mutations'
import { ME } from '@/graphql/queries'
import { getErrorMessage } from '@/lib/apollo'

const schema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo').max(120, 'Nome muito longo'),
})

type FormData = z.infer<typeof schema>

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, { refetchQueries: [ME] })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema), values: { name: user?.name ?? '' } })

  const onSubmit = handleSubmit(async ({ name }) => {
    try {
      await updateProfile({ variables: { name } })
      toast.success('Perfil atualizado')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível salvar as alterações'))
    }
  })

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  if (!user) return null

  return (
    <div className="flex justify-center">
      <Card className="flex w-full max-w-[448px] flex-col gap-8 p-8">
        <div className="flex flex-col items-center gap-4 border-b border-gray-200 pb-8">
          <Avatar name={user.name} size="lg" />
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="max-w-full text-xl font-bold break-words text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Input label="Nome completo" icon={UserRound} autoComplete="name" error={errors.name?.message} {...register('name')} />
            <Input label="E-mail" icon={Mail} value={user.email} disabled readOnly helper="O e-mail não pode ser alterado" />
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" fullWidth loading={loading} disabled={!isDirty}>
              Salvar alterações
            </Button>
            <Button type="button" variant="outline" fullWidth icon={LogOut} onClick={handleSignOut}>
              Sair da conta
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
