import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Task description is required');
      console.error('Task description is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/tasks', { description: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    tasks.forEach((task, index) => {
      doc.text(`${index + 1}. ${task.description} ${task.completed ? '(Completed)' : ''}`, 10, 10 + (index * 10));
    });
    doc.save('tasks.pdf');
  };

  return (
    <Container>
      <Row className="my-4 justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <h1 className="text-center">To-Do List</h1>
          <img src="https://img.freepik.com/free-vector/businessman-holding-pencil-big-complete-checklist-with-tick-marks_1150-35019.jpg?w=996&t=st=1720493119~exp=1720493719~hmac=542ee4f1c9a202636e09cc4ce7923ff8db9bc4be8d08304e4503b39d0e15f474" alt="Tasklist Logo" className="rounded-circle shadow-4-strong mb-3 mx-auto d-block img-fluid" />
          <Button variant="success" className="mb-3 w-100" onClick={downloadPDF}>Download PDF</Button>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="New Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button variant="primary" onClick={addTask}>Add Task</Button>
          </InputGroup>
          <ListGroup>
            {tasks.map(task => (
              <ListGroup.Item key={task._id} className="d-flex justify-content-between align-items-center">
                <div>
                  <Form.Check
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task._id, task.completed)}
                  />
                  <span className={task.completed ? 'text-decoration-line-through' : ''}>{task.description}</span>
                </div>
                <Button variant="danger" onClick={() => deleteTask(task._id)}>Delete</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskList;
