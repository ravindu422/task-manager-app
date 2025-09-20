import React, { Children, createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const lightTheme = {
    background: '#f5f5f5',
    surface: '#ffffff',
    primary: '#2196F3',
    secondary: '#4CAF50',
    accent: '#FF9800',
    error: '#f44336',
    warning: '#FF9800',
    success: '#4CAF50',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#dddddd',
    borderLight: '#eeeeee',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.5)',
    priority: {
        low: '#4CAF50',
        medium: '#FF9800',
        high: '#f44336',
        urgent: '#9C27B0'
    },
    status: {
        completed: '#4CAF50',
        pending: '#FF9800',
        overdue: '#f44336'
    }
};

export const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#64B5F6',
  secondary: '#81C784',
  accent: '#FFB74D',
  error: '#EF5350',
  warning: '#FFB74D',
  success: '#81C784',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  textMuted: '#666666',
  border: '#333333',
  borderLight: '#444444',
  shadow: '#000000',
  overlay: 'rgba(255, 255, 255, 0.1)',
  priority: {
    low: '#81C784',
    medium: '#FFB74D',
    high: '#EF5350',
    urgent: '#BA68C8'
  },
  status: {
    completed: '#81C784',
    pending: '#FFB74D',
    overdue: '#EF5350'
  }
};

export const ThemeProvider = ({ Children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('system');
    const [currentTheme, setCurrentTheme] = useState(lightTheme);

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        updateCurrentTheme();
    }, [themeMode, systemColorScheme]);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('@theme_preference');
            if (savedTheme) {
                setThemeMode(savedTheme);
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        }
    };

    const updateCurrentTheme = () => {
        let newTheme;

        if (themeMode === 'system') {
            newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        } else {
            newTheme = themeMode === 'dark' ? darkTheme : lightTheme;
        }

        setCurrentTheme(newTheme);
    };

    const changeTheme = async (mode) => {
        try {
            setThemeMode(mode);
            await AsyncStorage.setItem('@theme_preference', mode);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = currentTheme === lightTheme ? 'dark' : 'light';
        changeTheme(newMode);
    }

    const isDark = currentTheme === darkTheme;

    const value = {
        theme: currentTheme,
        themeMode,
        isDark,
        toggleTheme,
        changeTheme,
        lightTheme,
        darkTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            { Children }
        </ThemeContext.Provider>
    );
}
