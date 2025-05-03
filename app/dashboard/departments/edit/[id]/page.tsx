"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_DEPARTMENTS,
  UPDATE_DEPARTMENT,
  CREATE_SUB_DEPARTMENT,
} from "@/lib/graphql/queries";
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
import { ArrowLeft, Plus } from "lucide-react";

export default function EditDepartmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const { id }: any = params;
  // const { id } = use(params);

  const [name, setName] = useState("");
  const [newSubDept, setNewSubDept] = useState("");

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(GET_DEPARTMENTS, {
    fetchPolicy: "network-only",
  });

  const [updateDepartment, { loading: updateLoading }] = useMutation(
    UPDATE_DEPARTMENT,
    {
      onCompleted: () => {
        toast({
          title: "Department updated",
          description: "The department has been successfully updated",
        });
        refetch(); // Refetch to update the cache
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      update: (cache, { data }) => {
        if (!data) return;

        // Read the current departments from the cache
        const existingData: any = cache.readQuery({ query: GET_DEPARTMENTS });

        if (existingData) {
          // Find and update the department in the cache
          const updatedDepartments = existingData.getDepartments.map(
            (dept: any) => {
              if (dept.id === id) {
                return { ...dept, name: data.updateDepartment.name };
              }

              // Check if it's in subdepartments
              if (dept.subDepartments) {
                const updatedSubDepts = dept.subDepartments.map(
                  (subDept: any) => {
                    if (subDept.id === id) {
                      return { ...subDept, name: data.updateDepartment.name };
                    }
                    return subDept;
                  }
                );

                return { ...dept, subDepartments: updatedSubDepts };
              }

              return dept;
            }
          );

          // Write the updated departments back to the cache
          cache.writeQuery({
            query: GET_DEPARTMENTS,
            data: { getDepartments: updatedDepartments },
          });
        }
      },
    }
  );

  const [createSubDepartment, { loading: createSubLoading }] = useMutation(
    CREATE_SUB_DEPARTMENT,
    {
      onCompleted: () => {
        toast({
          title: "Sub-department added",
          description: "The sub-department has been successfully added",
        });
        setNewSubDept("");
        refetch(); // Refetch to update the cache
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      update: (cache, { data }) => {
        if (!data) return;

        // Read the current departments from the cache
        const existingData: any = cache.readQuery({ query: GET_DEPARTMENTS });

        if (existingData) {
          // Find the parent department and add the new subdepartment
          const updatedDepartments = existingData.getDepartments.map(
            (dept: any) => {
              if (dept.id === id) {
                const updatedSubDepts = [
                  ...(dept.subDepartments || []),
                  data.createSubDepartment,
                ];
                return { ...dept, subDepartments: updatedSubDepts };
              }
              return dept;
            }
          );

          // Write the updated departments back to the cache
          cache.writeQuery({
            query: GET_DEPARTMENTS,
            data: { getDepartments: updatedDepartments },
          });
        }
      },
    }
  );
  console.log("id", "id", "params");
  // Find the current department in the data
  const findDepartment = (departments: any[], targetId: string): any => {
    for (const dept of departments || []) {
      if (dept.id === targetId) {
        return dept;
      }

      if (dept.subDepartments && dept.subDepartments.length > 0) {
        const found = dept.subDepartments.find(
          (sub: any) => sub.id === targetId
        );
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (data && data.getDepartments) {
      const department = findDepartment(data.getDepartments, id);
      if (department) {
        setName(department.name);
      }
    }
  }, [data, id]);

  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    updateDepartment({
      variables: {
        input: {
          id,
          name: name.trim(),
        },
      },
    });
  };

  const handleAddSubDepartment = () => {
    if (newSubDept.trim()) {
      createSubDepartment({
        variables: {
          parentId: id,
          name: newSubDept.trim(),
        },
      });
    }
  };

  if (queryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading department...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
        Error loading department: {error.message}
      </div>
    );
  }

  const department = findDepartment(data?.getDepartments || [], id);
  if (!department) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        Department not found. It may have been deleted. {id}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/departments")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Department</h1>
          <p className="text-muted-foreground">
            Update department details or add sub-departments
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={handleUpdateDepartment}>
            <CardHeader>
              <CardTitle>Department Details</CardTitle>
              <CardDescription>
                Update the department information
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  updateLoading || !name.trim() || name === department.name
                }
              >
                {updateLoading ? "Updating..." : "Update Department"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sub-Departments</CardTitle>
            <CardDescription>
              Manage sub-departments under this department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {department.subDepartments &&
              department.subDepartments.length > 0 ? (
                department.subDepartments.map((subDept: any) => (
                  <div key={subDept.id} className="flex items-center gap-2">
                    <div className="flex-1 p-2 border rounded-md bg-muted/50">
                      {subDept.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-2">
                  No sub-departments found
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a new sub-department"
                value={newSubDept}
                onChange={(e) => setNewSubDept(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAddSubDepartment}
                disabled={createSubLoading || !newSubDept.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
