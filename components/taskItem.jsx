import React, { useState } from "react";
import { Alert, Animated, StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [scaleValue] = useState(new Animated.Value(1));

    const handleToggle = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        onToggle(task.id);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(task.text);
    };

    const handleSaveEdit = () => {
        if (editText.trim().length === 0) {
            Alert.alert('Empty task', 'Task cannot be empty!');
            return;
        }
        
        onEdit(task.id, editText);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditText(task.text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete task', 'Are you sure you want to delete this task?',
            [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () =>onDelete(task.id) },]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday'
        } else {
            return `${diffDays} days ago`;
        }
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
            <View style={styles.taskItem}>
                <TouchableOpacity
                    style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
                    onPress={handleToggle}
                    activeOpacity={0.8}
                >
                    {task.completed && <AntDesign name="check" style={styles.checkmark} />}
                </TouchableOpacity>
                <View style={styles.taskContent}>
                    {isEditing ? (
                        <TextInput
                            style={styles.editInput}
                            value={editText}
                            onChangeText={setEditText}
                            onSubmitEditing={handleSaveEdit}
                            onBlur={handleSaveEdit}
                            autoFocus
                            multiline
                            maxLength={100}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                                {task.text}
                            </Text>
                            <Text style={styles.dateText}>
                                {formatDate(task.createdAt)}
                            </Text>
                        </View>
                    )}
                </View>

                {!isEditing ? (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEdit}
                            activeOpacity={0.7}
                        >
                            <AntDesign name="edit" style={styles.editButtonText} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                            activeOpacity={0.7}
                        >
                           <MaterialIcons name="delete" style={styles.deleteButtonText} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveEdit}
                            activeOpacity={0.7}
                        >
                            <AntDesign name="save" style={styles.saveButtonText}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancelEdit}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="cancel" style={styles.cancelButtonText} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    checkbox: {
        width: 24, 
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskContent: {
        flex: 1,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    taskText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    editInput: {
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
         paddingVertical: 8,
         backgroundColor: '#f9f9f9',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 14,
        color: 'white',
    },
    deleteButtonText: {
        fontSize: 14,
        color: 'White',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default TaskItem;