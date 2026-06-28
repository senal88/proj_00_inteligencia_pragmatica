import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import { AuthProvider } from './hooks/use-auth'
import { LoadingIndicator } from './components/LoadingIndicator'

const Direcao = lazy(() => import('./pages/Direcao'))
const Projetos = lazy(() => import('./pages/Projetos'))
const Problemas = lazy(() => import('./pages/Problemas'))
const PggsTrimestre = lazy(() => import('./pages/PggsTrimestre'))
const PmvDomino = lazy(() => import('./pages/PmvDomino'))
const Chat = lazy(() => import('./pages/Chat'))
const Diagnostico = lazy(() => import('./pages/Diagnostico'))
const Scorecard = lazy(() => import('./pages/Scorecard'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Onboarding = lazy(() => import('./pages/Onboarding'))

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-0">
              <LoadingIndicator />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Scorecard />} />
              <Route path="/direcao" element={<Direcao />} />
              <Route path="/pggs" element={<PggsTrimestre />} />
              <Route path="/pmv/:pggId" element={<PmvDomino />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/problemas" element={<Problemas />} />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
