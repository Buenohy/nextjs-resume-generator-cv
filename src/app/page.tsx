import Card from './components/Card';
import Input from './components/Input';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col gap-8">
          <Card title="Personal Details">
            <Input title="Full name" placeholder="Enter your full name" />
          </Card>
          <Card title="Links">
            <Input title="Linkedin" placeholder="Enter your linkedin" />
            <Input title="Phone" placeholder="Enter your phone" />
            <Input title="Site" placeholder="Enter your site" />
            <Input title="Email" placeholder="Enter your email" />
            <Input title="Github" placeholder="Enter your github" />
          </Card>
          <Card title="Professional Summary">
            <Input title="Summary" placeholder="Enter your full summary" />
          </Card>
        </div>
      </main>
    </div>
  );
}
