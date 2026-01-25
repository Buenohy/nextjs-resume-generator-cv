import Card from './components/Card';
import Input from './components/Input';
import Skills from './components/Skills';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col gap-8">
          <Card title="Personal Details">
            <Input title="Full name" placeholder="Enter your full name" />
          </Card>
          <Card title="Links">
            <Input title="Linkedin" placeholder="Enter linkedin" />
            <Input title="Phone" placeholder="Enter phone" />
            <Input title="Site" placeholder="Enter site" />
            <Input title="Email" placeholder="Enter email" />
            <Input title="Github" placeholder="Enter github" />
          </Card>
          <Card title="Professional Summary">
            <Input title="Summary" placeholder="Enter your full summary" />
          </Card>
          <Card title="Skills">
            <Skills title="Skills" placeholder="Enter skill" />
          </Card>
          <Card title="Experience">
            <div className="grid grid-cols-3 gap-4">
              <Input title="Role Title" placeholder="Enter your role title" />
              <Input title="Job Title" placeholder="Enter your job title" />
              <Input title="Date" placeholder="Enter your date" />
            </div>
            <Input
              title="Summary"
              placeholder="Enter your experience summary"
            />
            <Input
              title="Summary"
              placeholder="Enter your experience summary"
            />
            <Input
              title="Summary"
              placeholder="Enter your experience summary"
            />
            <Input
              title="Summary"
              placeholder="Enter your experience summary"
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
