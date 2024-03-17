import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  newTask: string = '';
  todo : any[] = [];
  done : any[] = [];

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const todoData = localStorage.getItem('todo');
    const doneData = localStorage.getItem('done');

    if (todoData) {
      this.todo = JSON.parse(todoData);
    }
    if (doneData) {
      this.done = JSON.parse(doneData);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addNewTask(): void {
    if (this.newTask.trim() !== '') {
      const data = {
        id: this.todo.length +1,
        content: this.newTask,
      }
      this.todo.push(data);
      this.newTask = '';
      this.saveToLocalStorage();

      this._snackBar.open('Task added successfully!', 'Close', {
        duration: 2000, 
      });
    } else {
      this._snackBar.open('Please enter a task!', 'Close', {
        duration: 2000, 
      });
    }
  }

  handleComplete(id: number) : void{
    const itemIndex = this.todo.findIndex(item => item.id === id);

    if (itemIndex !== -1) { 
      const completedItem = this.todo[itemIndex]; 
  
      this.todo.splice(itemIndex, 1);
      this.done.push(completedItem);
      this.saveToLocalStorage();
  
      this._snackBar.open('Task completed successfully!', 'Close', {
        duration: 2000,
      });
    }
  }

  handleDelete(id: number): void {
    const itemIndex = this.done.findIndex(item => item.id === id);
  
    if (itemIndex !== -1) { 
      this.done.splice(itemIndex, 1);
      this.saveToLocalStorage();
  
      this._snackBar.open('Task deleted successfully!', 'Close', {
        duration: 2000,
      });
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('todo', JSON.stringify(this.todo));
    localStorage.setItem('done', JSON.stringify(this.done));
  }
}
