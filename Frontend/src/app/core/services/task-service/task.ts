// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { Task } from '../../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private idCounter = 1;

  constructor() { }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Partial<Task>) {
    const newTask: Task = {
      id: this.idCounter++,
      name: task.name || '',
      description: task.description || '',
      done: false,
      priority: task.priority || 'green'
    };
    this.tasks.push(newTask);
  }

  updateTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      this.tasks[index] = {
        ...task,
        priority: task.priority || 'green'
      };
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}