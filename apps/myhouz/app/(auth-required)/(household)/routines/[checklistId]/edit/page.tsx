"use client";

import { useParams } from "next/navigation";

export default function EditChecklistPage() {
  const params = useParams<{ checklistId: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Edit Checklist</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Checklist ID: {params.checklistId}
      </p>
      <div className="mt-6 rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Edit checklist form placeholder
      </div>
    </div>
  );
}
