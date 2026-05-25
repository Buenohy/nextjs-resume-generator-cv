import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BuilderLoading() {
  return (
    <div className="bg-muted/30 min-h-screen pt-8 pb-12">
      <div className="max-w-8xl mx-auto sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="mb-12">
          <Skeleton className="h-10 w-full" />
        </div>

        <Card className="border-muted bg-background p-2.5 sm:p-5">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
