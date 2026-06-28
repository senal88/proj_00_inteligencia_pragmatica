import { Suspense } from 'react'
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Compass, Layers, AlertCircle, Bot, LogOut, Home } from 'lucide-react'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar'

function NavigationMenu() {
  const { signOut } = useAuth()
  const location = useLocation()
  const { setOpenMobile, isMobile } = useSidebar()

  const navItems = [
    { name: 'Início', path: '/', icon: Home },
    { name: '1. Minha Direção', path: '/direcao', icon: Compass },
    { name: '2. PGGs do Trimestre', path: '/pggs', icon: Layers },
    { name: '3. Diagnóstico SCG', path: '/diagnostico', icon: AlertCircle },
    { name: '4. Onboarding', path: '/onboarding', icon: Compass },
    { name: 'Max AI', path: '/chat', icon: Bot },
  ]

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <SidebarHeader className="p-6 border-b border-border bg-surface-1">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand" />
          <span className="text-2xl font-serif italic font-medium text-content">IP26</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-surface-1">
        <SidebarMenu className="px-4 py-4 gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.name}
                onClick={handleLinkClick}
                className={`hover:bg-surface-2 transition-colors h-10 data-[active=true]:bg-surface-3 data-[active=true]:text-content data-[active=true]:font-bold ${
                  location.pathname !== item.path ? 'text-content-muted hover:text-content' : ''
                }`}
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border bg-surface-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="hover:bg-surface-2 text-content-muted hover:text-content transition-colors h-10"
            >
              <LogOut className="w-4 h-4 shrink-0 mr-2" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Layout() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0">
        <LoadingIndicator />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />

  return (
    <SidebarProvider className="bg-surface-0 text-content selection:bg-brand/30">
      <NavigationMenu />
      <SidebarInset className="bg-surface-0 flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface-1 px-4 z-10">
          <SidebarTrigger className="text-content-muted hover:text-content hover:bg-surface-2" />
        </header>
        <main
          className={`flex-1 overflow-auto relative ${location.pathname === '/' ? 'p-0' : 'p-4 md:p-8'}`}
        >
          <div className="mx-auto max-w-6xl w-full h-full flex flex-col">
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center">
                  <LoadingIndicator />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
