import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { MenuItem, COURSES } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Bruschetta',
    description: 'Fresh tomatoes, garlic, basil on toasted bread',
    course: 'Starter',
    price: 45,
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'With lemon butter sauce and seasonal vegetables',
    course: 'Main',
    price: 120,
  },
  {
    id: '3',
    name: 'Chocolate Fondant',
    description: 'With vanilla ice cream',
    course: 'Dessert',
    price: 65,
  },
  {
    id: '4',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
    course: 'Starter',
    price: 55,
  },
  {
    id: '5',
    name: 'Beef Fillet',
    description: '250g grass-fed beef fillet with red wine sauce',
    course: 'Main',
    price: 180,
  },
  {
    id: '6',
    name: 'Crème Brûlée',
    description: 'Vanilla bean custard with caramelized sugar crust',
    course: 'Dessert',
    price: 60,
  },
    {
    id: '7',
    name: 'Craft Lemonade',
    description: 'House-made with fresh lemons, mint, and a hint of lavender',
    course: 'Drink',
    price: 25,
  },
  {
    id: '8',
    name: 'San Pellegrino',
    description: 'Sparkling mineral water',
    course: 'Drink',
    price: 20,
  },
    {
    id: '9',
    name: 'Truffle Parmesan Fries',
    description: 'Crispy fries tossed in truffle oil and grated parmesan',
    course: 'Side',
    price: 45,
  },
  {
    id: '10',
    name: 'Sautéed Seasonal Greens',
    description: 'Garlic and olive oil sautéed kale and spinach',
    course: 'Side',
    price: 35,
  },
];

export default function HomeScreen({ navigation }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const itemWithId: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setMenuItems(prevItems => [...prevItems, itemWithId]);
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
    Alert.alert('Removed', 'Menu item removed successfully!');
  };

  // Calculating average prices by course
  const averagePrices = useMemo(() => {
    const courseStats: { [key: string]: { total: number; count: number; average: number } } = {};
    
    // Initialize all course
    COURSES.forEach(course => {
      courseStats[course] = { total: 0, count: 0, average: 0 };
    });

    // Calculate total and count
    menuItems.forEach(item => {
      if (courseStats[item.course]) {
        courseStats[item.course].total += item.price;
        courseStats[item.course].count += 1;
      }
    });

    // Calculating averages
    COURSES.forEach(course => {
      if (courseStats[course].count > 0) {
        courseStats[course].average = courseStats[course].total / courseStats[course].count;
      }
    });

    return courseStats;
  }, [menuItems]);

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemDetails}>{item.course} - R{item.price.toFixed(2)}</Text>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeMenuItem(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
   
      <Text style={styles.header}>Christoffel's Menu</Text>

      {/* Total  Items */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Menu Items: {menuItems.length}</Text>
      </View>

      {/* Average Prices by Course */}
      <View style={styles.averageContainer}>
        <Text style={styles.averageHeader}>Average Prices by Course</Text>
        {COURSES.map(course => (
          averagePrices[course].count > 0 && (
            <View key={course} style={styles.averageItem}>
              <Text style={styles.averageText}>
                {course}: R{averagePrices[course].average.toFixed(2)} 
                <Text style={styles.countText}> ({averagePrices[course].count} items)</Text>
              </Text>
            </View>
          )
        ))}
        {menuItems.length === 0 && (
          <Text style={styles.noDataText}>No menu items to calculate averages</Text>
        )}
      </View>

      {/* Nav Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AddMenuItem', { addMenuItem })}
        >
          <Text style={styles.buttonText}>Add Menu Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('FilterByCourse', { menuItems })}
        >
          <Text style={styles.buttonText}>Filter by Course</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <Text style={styles.menuHeader}>Complete Menu ({menuItems.length} items)</Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        style={styles.menuList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No menu items yet. Add some dishes!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  summaryContainer: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  averageContainer: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  averageHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  averageItem: {
    marginBottom: 5,
  },
  averageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'normal',
    opacity: 0.8,
  },
  noDataText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    lineHeight: 20,
  },
  itemDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3498db',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});