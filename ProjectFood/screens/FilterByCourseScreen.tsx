import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../App';
import { MenuItem, COURSES } from '../types';

type FilterByCourseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FilterByCourse'>;

type Props = {
  navigation: FilterByCourseScreenNavigationProp;
  route: {
    params: {
      menuItems: MenuItem[];
    };
  };
};

export default function FilterByCourseScreen({ navigation, route }: Props) {
  const { menuItems } = route.params;
  const [selectedCourse, setSelectedCourse] = useState<string>('All');

  const filteredItems = useMemo(() => {
    if (selectedCourse === 'All') return menuItems;
    return menuItems.filter(item => item.course === selectedCourse);
  }, [menuItems, selectedCourse]);

  const courseStats = useMemo(() => {
    const stats: { [key: string]: { count: number; total: number } } = {};
    
    COURSES.forEach(course => {
      stats[course] = { count: 0, total: 0 };
    });

    menuItems.forEach(item => {
      if (stats[item.course]) {
        stats[item.course].count += 1;
        stats[item.course].total += item.price;
      }
    });

    return stats;
  }, [menuItems]);

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemDetails}>{item.course} - R{item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filter by Course</Text>
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCourse}
          onValueChange={(itemValue) => setSelectedCourse(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Courses" value="All" />
          {COURSES.map((courseItem) => (
            <Picker.Item key={courseItem} label={courseItem} value={courseItem} />
          ))}
        </Picker>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.resultsText}>
          Showing {filteredItems.length} of {menuItems.length} items
        </Text>
        
        {selectedCourse === 'All' && (
          <View style={styles.courseStats}>
            {COURSES.map(course => (
              courseStats[course].count > 0 && (
                <View key={course} style={styles.statItem}>
                  <Text style={styles.statText}>
                    {course}: {courseStats[course].count} items
                    {courseStats[course].count > 0 && 
                      ` (Avg: R${(courseStats[course].total / courseStats[course].count).toFixed(2)})`
                    }
                  </Text>
                </View>
              )
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        style={styles.menuList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {selectedCourse === 'All' 
              ? 'No menu items available.' 
              : `No menu items found for ${selectedCourse}.`
            }
          </Text>
        }
      />

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  statsContainer: {
    marginBottom: 20,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  courseStats: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    marginBottom: 5,
  },
  statText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  menuList: {
    flex: 1,
    marginBottom: 20,
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
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});