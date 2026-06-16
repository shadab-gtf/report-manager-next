"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { TextField, NumberField, SelectField, AddButton } from "./report-fields";
import { taskPriorities, taskStatuses } from "@/modules/reports/constants";
import type { TaskLogItem } from "@/types/report";

interface TaskLogStepProps {
  tasks: TaskLogItem[];
  updateTask: (taskId: string, patch: Partial<TaskLogItem>) => void;
  addTask: () => void;
  removeTask: (taskId: string) => void;
}

const taskCategories = ["Figma", "Coding", "Development", "Research", "Meeting", "Other"];

export function TaskLogStep({ tasks, updateTask, addTask, removeTask }: TaskLogStepProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task, index) => (
        <div key={task.id} className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-foreground">Task {index + 1}</h2>
            <button
              type="button"
              title="Remove task"
              onClick={() => removeTask(task.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-danger hover:bg-danger-light"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField
              label="Task description"
              value={task.description}
              onChange={(value) => updateTask(task.id, { description: value })}
            />
            <SelectField
              label="Category"
              value={task.category}
              options={taskCategories}
              onChange={(value) => updateTask(task.id, { category: value })}
            />
            <SelectField
              label="Priority"
              value={task.priority}
              options={taskPriorities}
              onChange={(value) => updateTask(task.id, { priority: value })}
            />
            <SelectField
              label="Status"
              value={task.status}
              options={taskStatuses}
              onChange={(value) => updateTask(task.id, { status: value })}
            />
            <NumberField
              label="Time spent"
              value={task.timeSpent}
              onChange={(value) => updateTask(task.id, { timeSpent: value })}
            />
            <NumberField
              label="Completion %"
              value={task.completion}
              onChange={(value) => updateTask(task.id, { completion: value })}
            />
            <TextField
              label="Expected date"
              type="date"
              value={task.expectedCompletionDate}
              onChange={(value) => updateTask(task.id, { expectedCompletionDate: value })}
            />
            <TextField
              label="Notes"
              value={task.notes}
              onChange={(value) => updateTask(task.id, { notes: value })}
            />
          </div>
        </div>
      ))}
      <AddButton onClick={addTask}>Add task row</AddButton>
    </div>
  );
}
