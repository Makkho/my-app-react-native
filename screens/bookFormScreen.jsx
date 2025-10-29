import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bookService from '../services/bookService';
import colors from '../constants/colors';

const BookFormScreen = ({ route, navigation }) => {
  const existingBook = route.params?.book;
  const isEditing = !!existingBook;

  const [formData, setFormData] = useState({
    name: '',
    author: '',
    editor: '',
    year: '',
    read: false,
    favorite: false,
    rating: null,
    theme: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingBook) {
      setFormData({
        name: existingBook.name || '',
        author: existingBook.author || '',
        editor: existingBook.editor || '',
        year: existingBook.year?.toString() || '',
        read: existingBook.read || false,
        favorite: existingBook.favorite || false,
        rating: existingBook.rating,
        theme: existingBook.theme || '',
      });
    }
  }, [existingBook]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Modifier le livre' : 'Ajouter un livre',
    });
  }, [isEditing]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du livre est requis';
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'auteur est requis";
    }

    if (!formData.editor.trim()) {
      newErrors.editor = "L'éditeur est requis";
    }

    if (!formData.year) {
      newErrors.year = "L'année est requise";
    } else if (isNaN(formData.year) || formData.year.length !== 4) {
      newErrors.year = "L'année doit être un nombre de 4 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      
      const bookData = {
        name: formData.name.trim(),
        author: formData.author.trim(),
        editor: formData.editor.trim(),
        year: parseInt(formData.year),
        read: formData.read,
        favorite: formData.favorite,
        rating: formData.rating,
        theme: formData.theme.trim() || null,
      };

      if (isEditing) {
        await bookService.updateBook(existingBook.id, bookData);
        Alert.alert('Succès', 'Livre modifié avec succès');
      } else {
        await bookService.createBook(bookData);
        Alert.alert('Succès', 'Livre ajouté avec succès');
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nom du livre <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Ex: Le Seigneur des Anneaux"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Auteur <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.author && styles.inputError]}
              placeholder="Ex: J.R.R. Tolkien"
              value={formData.author}
              onChangeText={(value) => handleChange('author', value)}
            />
            {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Éditeur <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.editor && styles.inputError]}
              placeholder="Ex: Christian Bourgois"
              value={formData.editor}
              onChangeText={(value) => handleChange('editor', value)}
            />
            {errors.editor && <Text style={styles.errorText}>{errors.editor}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Année de publication <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.year && styles.inputError]}
              placeholder="Ex: 1954"
              value={formData.year}
              onChangeText={(value) => handleChange('year', value)}
              keyboardType="numeric"
              maxLength={4}
            />
            {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thème</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fantasy, Science-Fiction, Polar..."
              value={formData.theme}
              onChangeText={(value) => handleChange('theme', value)}
            />
          </View>

          <View style={styles.switchesContainer}>
            <View style={styles.switchGroup}>
              <View style={styles.switchLabel}>
                <Ionicons
                  name={formData.read ? 'checkmark-circle' : 'time-outline'}
                  size={24}
                  color={formData.read ? colors.success : colors.warning}
                />
                <Text style={styles.label}>Livre lu</Text>
              </View>
              <Switch
                value={formData.read}
                onValueChange={(value) => handleChange('read', value)}
                trackColor={{ false: colors.border, true: colors.successLight }}
                thumbColor={formData.read ? colors.success : colors.textLight}
              />
            </View>

            <View style={styles.switchGroup}>
              <View style={styles.switchLabel}>
                <Ionicons
                  name={formData.favorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={formData.favorite ? colors.danger : colors.textLight}
                />
                <Text style={styles.label}>Favori</Text>
              </View>
              <Switch
                value={formData.favorite}
                onValueChange={(value) => handleChange('favorite', value)}
                trackColor={{ false: colors.border, true: colors.dangerLight }}
                thumbColor={formData.favorite ? colors.danger : colors.textLight}
              />
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Note</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleChange('rating', star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={formData.rating >= star ? 'star' : 'star-outline'}
                    size={32}
                    color={formData.rating >= star ? colors.warning : colors.textLight}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'add'}
              size={24}
              color={colors.textWhite}
            />
            <Text style={styles.submitButtonText}>
              {loading
                ? 'En cours...'
                : isEditing
                ? 'Modifier le livre'
                : 'Ajouter le livre'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  switchesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 10,
  },
  ratingContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  starButton: {
    padding: 8,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BookFormScreen;