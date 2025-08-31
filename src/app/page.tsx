import { GameInterface } from '@/components/GameInterface';
import { EnvCheck } from '@/components/EnvCheck';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <EnvCheck />
      <GameInterface />
    </main>
  );
}
