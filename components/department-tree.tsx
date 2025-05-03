"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Edit, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Department {
  id: string
  name: string
  subDepartments?: Department[]
}

interface DepartmentNodeProps {
  department: Department
  level: number
  onDelete: (id: string) => void
}

function DepartmentNode({ department, level, onDelete }: DepartmentNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = department.subDepartments && department.subDepartments.length > 0

  return (
    <div className="mb-1">
      <div
        className={cn(
          "flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
          level === 0 ? "bg-slate-50 dark:bg-slate-900" : "",
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {hasChildren ? (
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-1" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <div className="w-7"></div>
        )}
        <span className="flex-1 font-medium">{department.name}</span>
        <div className="flex items-center gap-1">
          <Link href={`/dashboard/departments/edit/${department.id}`}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => onDelete(department.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="ml-2 border-l border-slate-200 dark:border-slate-700 pl-2">
          {department.subDepartments?.map((subDept) => (
            <DepartmentNode key={subDept.id} department={subDept} level={level + 1} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

interface DepartmentTreeProps {
  departments: Department[]
  onDelete?: (id: string) => void
}

export function DepartmentTree({ departments, onDelete = () => {} }: DepartmentTreeProps) {
  if (!departments || departments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No departments found. Create your first department to get started.
      </div>
    )
  }

  return (
    <div className="border rounded-md p-2">
      {departments.map((department) => (
        <DepartmentNode key={department.id} department={department} level={0} onDelete={onDelete} />
      ))}
    </div>
  )
}
