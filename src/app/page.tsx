import Card from './components/Card';
import Input from './components/Input';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <Card>
            <Input title="Full name" placeholder="Enter your full name" />
          </Card>
        </div>
      </main>
    </div>
  );
}
