import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddMenuItemScreen from './screens/AddMenuItemScreen';
import FilterByCourseScreen from './screens/FilterByCourseScreen';
import { MenuItem } from './types';

export type RootStackParamList = {
  Home: undefined;
  AddMenuItem: { addMenuItem: (item: Omit<MenuItem, 'id'>) => void };
  FilterByCourse: { menuItems: MenuItem[] };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: "Christoffel's Menu" }}
        />
        <Stack.Screen 
          name="AddMenuItem" 
          component={AddMenuItemScreen}
          options={{ title: "Add Menu Item" }}
        />
        <Stack.Screen 
          name="FilterByCourse" 
          component={FilterByCourseScreen}
          options={{ title: "Filter by Course" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}