"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { cva } from "class-variance-authority";
import { useQuery } from "convex/react";

const statusVariants = cva("", {
  variants: {
    status: {
      succeeded: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      expired: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
    },
  },
});

export default function AdminPage() {
  const topups = useQuery(api.topups.list, {});

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage topups</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Top-up Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {topups?.length === 0 ? (
                <p className="text-muted-foreground">
                  No top-up attempts found
                </p>
              ) : (
                <div className="space-y-4">
                  {topups?.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{attempt.id}</span>
                          <Badge
                            className={statusVariants({
                              status: attempt.status,
                            })}
                          >
                            {attempt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Payment ID: {attempt.paymentId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          User: {attempt.userId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(attempt.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${attempt.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {attempt.tokens.toLocaleString()} tokens
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
