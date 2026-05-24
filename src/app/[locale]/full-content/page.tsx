import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExperienceSectionFullContent } from "@/components/sections/experience-section-full-content";

export default function FullContentPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Full Content En Us Page</h1>
      <Card className="shadow-primary/50 border-muted shadow-lg">
        <CardHeader>
          <CardTitle>Full Content En Us</CardTitle>
          <CardDescription>Todo o conteúdo do currículo En Us</CardDescription>
        </CardHeader>

        <ExperienceSectionFullContent />
      </Card>
    </div>
  );
}
