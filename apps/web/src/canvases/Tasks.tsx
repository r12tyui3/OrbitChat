import React from 'react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface TasksProps {
  tasks: Task[];
}

export const Tasks: React.FC<TasksProps> = ({ tasks }) => {
  return (
    <div className="tasks-canvas">
      <h3>Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} readOnly />
            <span>{task.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};