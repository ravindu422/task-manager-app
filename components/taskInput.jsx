import React, { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View, StyleSheet, Text } from "react-native";

const TaskInput = ({ onAddTask }) => {
    const [taskText, setTaskText] = useState('');
    const handleAddTask = () => {
        if (taskText.trim().length === 0) {
            Alert.alert('Empty Task', 'Please enter a task before adding!');
            return;
        }

        if (taskText.trim().length > 100) {
            Alert.alert('Task too Long', 'Please keep tasks under 100 characters');
            return;
        }

        onAddTask(taskText);
        setTaskText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Add a new task..."
                    placeholderTextColor="#999"
                    value={taskText}
                    onChangeText={setTaskText}
                    onSubmitEditing={handleAddTask}
                    returnKeyType="done"
                    multiline={false}
                    maxLength={100}
                />
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        taskText.trim().length === 0 && styles.addButtonDisabled
                    ]}
                    onPress={handleAddTask}
                    activeOpacity={0.8}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                    {taskText.length} / 100
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1},
        shadowRadius: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginRight: 10,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    addButtonDisabled: {
        backgroundColor: '#cccccc',
        elevation: 1,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    counterContainer: {
        alignItems: 'flex-end',
    },
    counterText: {
        fontSize: 12,
        color: '#999',
    },

})

export default TaskInput;