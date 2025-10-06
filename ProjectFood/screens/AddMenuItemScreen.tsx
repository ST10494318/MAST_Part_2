import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../App';
import { MenuItem, COURSES } from '../types';

type AddMenuItemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddMenuItem'>;

type Props = {
  navigation: AddMenuItemScreenNavigationProp;
  route: {
    params: {
      addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    };
  };
};

export default function AddMenuItemScreen({ navigation, route }: Props) {
  const { addMenuItem } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(COURSES[0]);
  const [price, setPrice] = useState('');

  const handleAddItem = () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    addMenuItem({
      name: name.trim(),
      description: description.trim(),
      course,
      price: numericPrice,
    });

    // Reset form
    setName('');
    setDescription('');
    setCourse(COURSES[0]);
    setPrice('');
  };

  const isFormValid = name.trim() && description.trim() && price.trim() && parseFloat(price) > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Add New Menu Item</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={course}
              onValueChange={(itemValue) => setCourse(itemValue)}
              style={styles.picker}
            >
              {COURSES.map((courseItem) => (
                <Picker.Item key={courseItem} label={courseItem} value={courseItem} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.addButton, !isFormValid && styles.disabledButton]} 
            onPress={handleAddItem}
            disabled={!isFormValid}
          >
            <Text style={styles.addButtonText}>Add Menu Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 15,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});