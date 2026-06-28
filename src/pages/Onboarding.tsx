import { Link } from 'react-router-dom'
import { Compass, Target, Stethoscope, LayoutDashboard, MessageSquare } from 'lucide-react'

export default function Onboarding() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="ds-dash-title">Comece aqui sua jornada pragmática</h1>
        <p className="text-muted-foreground text-lg">
          Escolha um dos módulos abaixo para iniciar sua jornada e alcançar os seus objetivos
          estratégicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Link to="/direcao" className="block group h-full">
          <div className="ds-card h-full flex flex-col items-start justify-center space-y-4 p-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            <Compass className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            <h2 className="ds-section-title text-white">Minha Direção</h2>
          </div>
        </Link>

        <Link to="/pggs" className="block group h-full">
          <div className="ds-card h-full flex flex-col items-start justify-center space-y-4 p-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            <Target className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            <h2 className="ds-section-title text-white">PGG do Trimestre</h2>
          </div>
        </Link>

        <Link to="/diagnostico" className="block group h-full">
          <div className="ds-card h-full flex flex-col items-start justify-center space-y-4 p-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            <Stethoscope className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            <h2 className="ds-section-title text-white">Diagnóstico SCG</h2>
          </div>
        </Link>

        <Link to="/" className="block group h-full">
          <div className="ds-card h-full flex flex-col items-start justify-center space-y-4 p-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            <LayoutDashboard className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            <h2 className="ds-section-title text-white">Scorecard Estratégico</h2>
          </div>
        </Link>

        <Link to="/chat" className="block group h-full md:col-span-2 lg:col-span-2">
          <div className="ds-card h-full flex flex-col items-start justify-center space-y-4 p-8 hover:bg-primary/5 hover:border-primary transition-all duration-300">
            <MessageSquare className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            <h2 className="ds-section-title text-white">Max AI</h2>
          </div>
        </Link>
      </div>
    </div>
  )
}
