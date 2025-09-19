import { useState } from "react";
import { StatusBar, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [tasks, setTasks] = useState([]);
  const [taskIdCounter, setTaskIdCounter] = useState(1);

  const addTask = (taskText) => {
    if (taskText.trim().lenght > 0) {
      const newTask = {
        id: taskIdCounter,
        text: taskText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
      setTaskIdCounter(taskIdCounter + 1);
    }
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, newText) => {
    if (newText.trim().lenght > 0) {
      setTasks(tasks.map(task => 
        task.id === taskId
          ? { ...task, text: newText.trim() }
          : task
      ));
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000"/>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSubtitle}>
          {completedTasks} of {totalTasks} completed
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  taskContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
