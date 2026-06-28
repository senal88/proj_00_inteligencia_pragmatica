import bookCover from '@/assets/image-d1dd8.png'

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={bookCover}
        alt="Carregando..."
        className="h-24 w-auto rounded-md shadow-xl animate-pulse border border-white/10"
      />
    </div>
  )
}
