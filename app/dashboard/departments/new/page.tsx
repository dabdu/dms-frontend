"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_DEPARTMENT, GET_DEPARTMENTS } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";

export default function NewDepartmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [subDepartments, setSubDepartments] = useState<{ name: string }[]>([]);
  const [newSubDept, setNewSubDept] = useState("");

  const { refetch } = useQuery(GET_DEPARTMENTS, { skip: true });

  const [createDepartment, { loading }] = useMutation(CREATE_DEPARTMENT, {
    onCompleted: () => {
      toast({
        title: "Department created",
        description: "The department has been successfully created",
      });
      // Refetch departments data to update the cache
      refetch();
      router.push("/dashboard/departments");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    update: (cache, { data }) => {
      // Read the current departments from the cache
      const existingData: any = cache.readQuery({ query: GET_DEPARTMENTS });

      if (existingData && data) {
        // Add the new department to the list
        const newDepartment = data.createDepartment;

        cache.writeQuery({
          query: GET_DEPARTMENTS,
          data: {
            getDepartments: [...existingData.getDepartments, newDepartment],
          },
        });
      }
    },
  });

  const handleAddSubDepartment = () => {
    if (newSubDept.trim()) {
      setSubDepartments([...subDepartments, { name: newSubDept.trim() }]);
      setNewSubDept("");
    }
  };

  const handleRemoveSubDepartment = (index: number) => {
    setSubDepartments(subDepartments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: any = {
      name: name.trim(),
    };

    if (subDepartments.length > 0) {
      input.subDepartments = subDepartments;
    }

    createDepartment({
      variables: {
        input,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          onClick={() => router.push("/dashboard/departments")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Department</h1>
          <p className="text-muted-foreground">
            Create a new department or sub-department for your organization
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
            <CardDescription>
              Enter the information for the new department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                placeholder="Enter department name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sub-Departments</Label>
                <div className="text-sm text-muted-foreground">
                  {subDepartments.length} sub-department(s)
                </div>
              </div>

              <div className="space-y-2">
                {subDepartments.map((subDept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 p-2 border rounded-md bg-muted/50">
                      {subDept.name}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSubDepartment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a sub-department"
                  value={newSubDept}
                  onChange={(e) => setNewSubDept(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleAddSubDepartment}
                  disabled={!newSubDept.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/departments")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create Department"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
