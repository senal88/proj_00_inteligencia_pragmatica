import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import pb from '@/lib/pocketbase/client'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

import { LoadingIndicator } from '@/components/LoadingIndicator'
import maxHeroImg from '@/assets/design-sem-nome-2ef1e.png'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0">
        <LoadingIndicator />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/onboarding" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await pb.collection('users').authWithPassword(email, password)
        toast.success('Bem-vindo!')
        window.location.href = '/onboarding'
      } else {
        if (password !== confirmPassword) {
          toast.error('As senhas não coincidem.')
          setLoading(false)
          return
        }

        try {
          await pb.collection('users').create({
            email,
            password,
            passwordConfirm: confirmPassword,
            name,
          })

          await pb.collection('users').authWithPassword(email, password)
          toast.success('Conta criada com sucesso!')
          window.location.href = '/onboarding'
        } catch (err: any) {
          const fieldErrors = extractFieldErrors(err)
          if (
            err.response?.data?.email?.code === 'validation_not_unique' ||
            (fieldErrors.email && fieldErrors.email.toLowerCase().includes('already in use'))
          ) {
            toast.error('Este e-mail já está em uso.')
          } else {
            toast.error(getErrorMessage(err))
          }
          setLoading(false)
          return
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row bg-surface-0">
      {/* Hero Section - Desktop Only */}
      <aside className="hidden md:flex md:w-[55%] relative flex-col justify-between overflow-hidden bg-[#0a0a0a]">
        {/* Background Effects */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.15) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Top bar / Logo */}
        <div className="relative z-10 p-6 md:p-8 flex items-center gap-3">
          <Compass className="w-8 h-8 text-brand" />
          <span className="font-serif italic text-2xl font-medium tracking-tight text-white">
            IP26
          </span>
        </div>

        {/* Main Grid Content */}
        <div className="relative z-10 flex-1 w-full grid md:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_1fr] items-center md:gap-4 xl:gap-6 animate-fade-in">
          {/* Hero Content */}
          <div className="p-6 md:p-8 md:pl-16 md:pr-0 flex flex-col justify-center max-w-full">
            <p className="text-brand uppercase tracking-[0.2em] font-semibold text-xs sm:text-sm mb-3">
              MAX PETERS · MÉTODO DE GESTÃO
            </p>
            <h1
              className="font-serif italic text-white leading-[1.1] mb-4"
              style={{ fontSize: 'clamp(30px, 3.6vw, 56px)' }}
            >
              Inteligência
              <br />
              Pragmática
            </h1>
            <p className="text-content-muted text-base sm:text-lg leading-relaxed">
              Um ecossistema desenhado para líderes que buscam previsibilidade, crescimento contínuo
              e gestão focada em resultados.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative h-full w-full flex items-end justify-center pointer-events-none">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] rounded-t-full bg-gradient-to-t from-brand/15 via-brand/5 to-transparent blur-2xl z-0"
            />
            <img
              src={maxHeroImg}
              alt="Max Peters"
              draggable={false}
              className="h-[85%] lg:h-[90%] xl:h-[94%] w-auto object-contain object-bottom z-10 select-none drop-shadow-[0_20px_60px_rgba(0,0,0,0.55)] animate-fade-in-up relative"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 100%)',
              }}
            />
          </div>
        </div>

        {/* Hero Footer */}
        <div className="relative z-10 border-t border-white/10 p-4 md:px-16 md:py-4 mt-auto">
          <p className="text-xs text-white/40 tracking-widest uppercase">
            Edição 2026 · Adapta · Inteligência Pragmática
          </p>
        </div>
      </aside>

      {/* Form Section */}
      <div className="flex-1 w-full md:w-[45%] flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-14 relative bg-surface-0 overflow-y-auto">
        <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up my-auto">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-6">
            <Compass className="w-8 h-8 text-brand" />
            <span className="font-serif italic text-2xl font-medium tracking-tight text-white">
              IP26
            </span>
          </div>

          <div className="mb-5 text-left">
            <h2 className="text-3xl font-serif italic text-foreground mb-2">
              {isLogin ? 'Acesse seu workspace' : 'Crie sua conta'}
            </h2>
            <p className="text-content-muted">
              {isLogin
                ? 'Bem-vindo de volta. Entre para continuar sua jornada.'
                : 'Inicie sua jornada rumo a uma gestão de excelência.'}
            </p>
          </div>

          {/* Segmented Auth Toggle */}
          <div className="flex p-1 bg-surface-1 rounded-lg mb-5 border border-border shadow-inner">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setConfirmPassword('')
              }}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200',
                isLogin
                  ? 'bg-surface-3 text-foreground shadow-sm border border-white/5'
                  : 'text-content-muted hover:text-foreground hover:bg-surface-2',
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setName('')
              }}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200',
                !isLogin
                  ? 'bg-surface-3 text-foreground shadow-sm border border-white/5'
                  : 'text-content-muted hover:text-foreground hover:bg-surface-2',
              )}
            >
              Criar conta
            </button>
          </div>

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface-0/80 backdrop-blur-sm rounded-xl">
                <LoadingIndicator />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="name" className="text-content-dim">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-surface-2 border-border focus-visible:ring-brand/30 transition-colors"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-content-dim">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-surface-2 border-border focus-visible:ring-brand/30 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-content-dim">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-surface-2 border-border focus-visible:ring-brand/30 transition-colors"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="confirmPassword" className="text-content-dim">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="bg-surface-2 border-border focus-visible:ring-brand/30 transition-colors"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-4 bg-brand text-black hover:bg-brand-hover hover:text-black font-semibold transition-colors"
                disabled={loading}
                size="lg"
              >
                {loading
                  ? isLogin
                    ? 'Entrando...'
                    : 'Criando conta...'
                  : isLogin
                    ? 'Entrar'
                    : 'Criar conta'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
