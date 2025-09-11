import { Button } from "@/components/ui/button";
import { Link, XCircle } from "lucide-react";

export default async function CancelPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const amount = searchParams.amount;
  const tokens = searchParams.tokens;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-8 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Payment Cancelled
            </h1>
            <p className="text-lg text-muted-foreground">
              Your payment was cancelled. No charges have been made.
            </p>
          </div>

          <div className="p-6 bg-muted/30 rounded-sm border border-muted space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount:</span>
              <span className="text-xl font-bold text-muted-foreground">
                ${amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Tokens:</span>
              <span className="text-lg font-bold text-muted-foreground">
                {tokens?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1" asChild>
              <Link href="/topup">Try Again</Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <Link href="/">Back to Game</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
