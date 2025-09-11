import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage(props: {
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Top-up Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your tokens have been added to your account.
            </p>
          </div>

          <div className="p-6 bg-muted/30 rounded-sm border border-muted space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount Paid:</span>
              <span className="text-2xl font-bold text-green-600">
                ${amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Tokens Added:</span>
              <span className="text-xl font-bold text-blue-600">
                {tokens?.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm transition-colors"
            asChild
          >
            <Link href="/">Continue to Game</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
