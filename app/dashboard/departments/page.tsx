"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DEPARTMENTS, DELETE_DEPARTMENT } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DepartmentTree } from "@/components/department-tree";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DepartmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS, {
    fetchPolicy: "network-only", // Don't use the cache for this query
  });

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: () => {
      toast({
        title: "Department deleted",
        description: "The department has been successfully deleted",
      });
      refetch(); // Refetch the departments after deletion
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    update: (cache) => {
      // Update the cache to remove the deleted department
      const existingDepartments = cache.readQuery({
        query: GET_DEPARTMENTS,
      });

      if (existingDepartments && deletingId) {
        const newDepartments = existingDepartments.getDepartments.filter(
          (dept: any) => dept.id !== deletingId
        );

        // Write the filtered departments back to the cache
        cache.writeQuery({
          query: GET_DEPARTMENTS,
          data: { getDepartments: newDepartments },
        });
      }
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteDepartment({
        variables: {
          id: deletingId,
        },
      });
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments and structure
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/departments/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading departments...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
          Error loading departments: {error.message}
        </div>
      ) : (
        <DepartmentTree
          departments={data?.getDepartments || []}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              department and all its sub-departments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
