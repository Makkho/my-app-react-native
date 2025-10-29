import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import bookService from '../services/bookService';
import { on as onEvent } from '../services/eventBus';
import BookCard from '../components/bookCard';
import LoadingSpinner from '../components/loadingSpinner';
import colors from '../constants/colors';

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadBooks = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message);
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Charger les livres au montage et à chaque focus
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  // Réagir aux événements externes (ajout/suppression/édition)
  useEffect(() => {
    const unsub = onEvent('books:changed', () => loadBooks());
    return () => unsub();
  }, []);

  const handleToggleRead = async (book) => {
    try {
      await bookService.toggleReadStatus(book.id, book.read);
      await loadBooks();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleRefresh = () => {
    loadBooks(true);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color={colors.textLight} />
      <Text style={styles.emptyTitle}>Aucun livre</Text>
      <Text style={styles.emptyText}>
        Commencez par ajouter votre premier livre
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BookForm')}
      >
        <Ionicons name="add" size={24} color={colors.textWhite} />
        <Text style={styles.addButtonText}>Ajouter un livre</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner message="Chargement des livres..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
            onToggleRead={handleToggleRead}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={books.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {books.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('BookForm')}
        >
          <Ionicons name="add" size={28} color={colors.textWhite} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default BookListScreen;