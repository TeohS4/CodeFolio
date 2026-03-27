import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Task } from '../../core/interfaces/task.interface';
import { PAGES_IMPORTS } from '../pages.imports';
import { AlertService } from '../../core/services/alert-service/alert';
import { HttpService } from '../../core/services/http-service/http';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './task.html',
  styleUrls: ['./task.scss'],
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  // object
  selectedTask: Task = {
    id: 0,
    name: '',
    description: '',
    done: false,
    priority: 'green'
  };

  dialogRef!: MatDialogRef<any>;

  @ViewChild('taskDialog', { static: true }) taskDialog!: TemplateRef<any>;

  constructor(
    private http: HttpService,
    private alert: AlertService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.http.get<Task[]>('task').subscribe({
      next: (res) => {
        this.tasks = res || [];
        this.cdr.detectChanges();
      },
      error: () => this.alert.error('Failed to load tasks')
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);

    // send updated order to backend
    this.http.post('task/reorder', this.tasks).subscribe({
      next: () => this.alert.success('Reordered'),
      error: () => {
        this.alert.error('Reorder failed');
        this.loadTasks();
      }
    });
  }

  toggleDone(task: Task): void {
    this.http.put(`task/${task.id}`, task).subscribe({
      next: () => {
        if (task.done) {
          this.alert.success('Task marked as done');
        } else {
          this.alert.success('Task marked as not done');
        }
      },
      error: () => {
        this.alert.error('Failed to Update');
      }
    });
  }

  openDialog(task?: Task): void {
    if (task) {
      this.selectedTask = JSON.parse(JSON.stringify(task));
    } else {
      this.selectedTask = {
        id: 0,
        name: '',
        description: '',
        done: false,
        priority: 'green'
      };
    }
    this.dialogRef = this.dialog.open(this.taskDialog, {
      width: '500px'
    });

    this.cdr.detectChanges();
  }

  saveTask(): void {
    if (!this.selectedTask.name) return;

    const request = this.selectedTask.id
      ? this.http.put(`task/${this.selectedTask.id}`, this.selectedTask)
      : this.http.post('task', this.selectedTask);
    request.subscribe({
      next: () => {
        // Close dialog
        if (this.dialogRef) this.dialogRef.close();
        this.loadTasks();
        this.alert.success(this.selectedTask.id ? 'Updated' : 'Saved');
        this.cdr.detectChanges();
      },
      error: () => this.alert.error('Save failed')
    });
  }

  deleteTask(id: number): void {
    this.http.delete('task', id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.cdr.detectChanges();
        this.alert.success('Deleted');
      },
      error: () => this.alert.error('Delete failed')
    });
  }

  trackById(index: number, task: Task) {
    return task.id;
  }
}