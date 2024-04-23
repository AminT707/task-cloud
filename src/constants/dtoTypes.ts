export {};

// User DTO
export class UserDTO {
    id: number;
    username: string;
    email: string;
    password: string;

    constructor(id: number, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

// Task DTO
export class TaskDTO {
    id: number;
    title: string;
    description?: string;
    due_date?: Date;
    status: string;
    user_id: number;

    constructor(id: number, title: string, status: string, user_id: number, description?: string, due_date?: Date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.due_date = due_date;
        this.status = status;
        this.user_id = user_id;
    }
}

export interface Task {
    name: string;
    location: string;
    month: number;
    date: number;
    hour: number;
    minute: number;
    year: number;
    amPm: string;
  }