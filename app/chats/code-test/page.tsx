import DifficultySelector from "./_components/difficulty-selector";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Coding Skills Assessment</h1>
      <DifficultySelector />
    </main>
  )
}
