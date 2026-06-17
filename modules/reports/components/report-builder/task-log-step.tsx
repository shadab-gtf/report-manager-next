"use client";

import { TrashIcon, DocumentTextIcon, ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import { TextField, NumberField, SelectField, AddButton, TextareaField } from "./report-fields";
import { TimePickerField } from "./time-picker-field";
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
        <div key={task.id} className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-600 focus-within:ring-2 focus-within:ring-blue-200 transition-shadow">
              <DocumentTextIcon className="h-4 w-4" />
              <input
                type="text"
                value={task.title ?? `Task ${index + 1}`}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                className="bg-transparent text-sm font-bold text-blue-600 outline-none w-28 focus:w-48 transition-all"
                placeholder={`Task ${index + 1}`}
              />
              <PencilIcon className="h-3 w-3 opacity-50" />
            </div>
            <button
              type="button"
              title="Remove task"
              onClick={() => removeTask(task.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
            <TimePickerField
              label="Time spent"
              value={task.timeSpent}
              onChange={(value) => updateTask(task.id, { timeSpent: value })}
              icon={<ClockIcon className="h-4 w-4" />}
            />
            <TextField
              label="Expected date"
              type="date"
              value={task.expectedCompletionDate}
              onChange={(value) => updateTask(task.id, { expectedCompletionDate: value })}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Notes"
                value={task.notes}
                onChange={(value) => updateTask(task.id, { notes: value })}
              />
            </div>
          </div>
        </div>
      ))}
      <AddButton onClick={addTask}>Add task row</AddButton>
    </div>
  );
}
