import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const TASK_STORAGE_KEY = '@task';
const TASK_COUNTER_KEY = '@task_counter';

const useTaskStorage = () => {
    const [tasks, setTasks] = useState([]);
    const [taskIdCounter, setTaskIdCounter] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const storedTasks = await AsyncStorage.getItem(TASK_STORAGE_KEY);
            if (storedTasks) {
                const parsedTasks = JSON.parse(storedTasks);
                const tasksWithDates = parsedTasks.map(task => ({
                    ...task,
                    createdAt: new Date(task.createdAt),
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                }));
                setTasks(tasksWithDates);
            }

            const storedCounter = await AsyncStorage.getItem(TASK_COUNTER_KEY);
            if (storedCounter) {
                setTaskIdCounter(parseInt(storedCounter, 10));
            }
        } catch (error) {
            console.error('Error loading data from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveTasks = async (newTasks) => {
        try {
            await AsyncStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(newTasks));
            setTasks(newTasks);
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const saveTaskCounter = async (counter) => {
        try {
            await AsyncStorage.setItem(TASK_COUNTER_KEY, counter.toString());
            setTaskIdCounter(counter);
        } catch (error) {
            console.error('Error saving task counter:', error);
        }
    };

    const addTask = async (taskText, priority = 'medium', category = 'personal', dueDate = null) => {
        if (taskText.trim().length > 0) {
            const newTask = {
                id: taskIdCounter,
                text: taskText.trim(),
                completed: false,
                priority,
                category,
                dueDate,
                createdAt: new Date(),
            };

            const updatedTasks = [newTask, ...tasks];
            await saveTasks(updatedTasks);
            await saveTaskCounter(taskIdCounter + 1);
        }      
    };

    const toggleTask = async (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null }
            : task
        );
        await saveTasks(updatedTasks);
    };

    const deleteTask = async (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        await saveTasks(updatedTasks);
    };

    const editTask = async (taskId, newText, priority, category, dueDate) => {
        if (newText.trim().length > 0) {
            const updatedTasks = tasks.map(task =>
                task.id === taskId
                    ? {
                        ...task,
                        text: newText.trim(),
                        priority: priority || task.priority,
                        category: category || task.category,
                        dueDate: dueDate !== undefined ? dueDate : task.dueDate,
                      }
                    :task
            );
            await saveTasks(updatedTasks);
        }
    };

    const updateTaskPriority = async (taskId, priority) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, priority } : task
        );
        await saveTasks(updatedTasks);
    };

    const updateTaskDueDate = async (taskId, dueDate) => {
        const updatedTasks = tasks.map(task => 
            task.id === taskId ? { ...task, dueDate } : task
        );
        await saveTasks(updatedTasks);
    };

    const clearAllTasks = async () => {
        try {
          await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
          setTasks([]);
        } catch (error) {
          console.error('Error clearing tasks:', error);
        }
    };

    const getTasksByPriority = () => {
        return tasks.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    };

    const getOverdueTasks = () => {
        const now = new Date();
        return tasks.filter(task =>
            !task.completed &&
            task.dueDate && 
            task.dueDate < now
        );
    };

    const getTasksDueToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return tasks.filter(task =>
            !task.completed &&
            task.dueDate &&
            task.dueDate >= today &&
            task.dueDate < tomorrow
        );
    };

    return {
        tasks, 
        taskIdCounter,
        loading,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        updateTaskPriority,
        updateTaskDueDate,
        clearAllTasks,
        getTasksByPriority,
        getOverdueTasks,
        getTasksDueToday,
        setTasks: saveTasks,
        setTaskIdCounter: saveTaskCounter,
    };
};

export default useTaskStorage;