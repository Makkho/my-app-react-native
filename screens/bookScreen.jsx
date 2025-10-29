import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  ScrollView
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

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [sortField, setSortField] = useState('name'); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  const loadBooks = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = {
        ...(query && { query }),
        ...(filter === 'read' && { read: true }),
        ...(filter === 'unread' && { read: false }),
        ...(filter === 'favorite' && { favorite: true }),
        ...(sortField && { sort: sortField, order: sortOrder }),
      };

      const data = await bookService.getAllBooks(params);
      setBooks(data || []);
    } catch (err) {
      setError(err.message);
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  useEffect(() => {
    const unsub = onEvent('books:changed', () => loadBooks());
    return () => unsub();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadBooks(), 400);
    return () => clearTimeout(t);
  }, [query, filter, sortField, sortOrder]);

  const handleToggleRead = async (book) => {
    try {
      await bookService.toggleReadStatus(book.id, book.read);
      await loadBooks();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleToggleFavorite = async (book) => {
    try {
      await bookService.toggleFavorite(book.id, book.favorite);
      await loadBooks();
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Impossible de changer le statut favori');
    }
  };

  const handleRefresh = () => {
    loadBooks(true);
  };

  const toggleSortOrder = () => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));

  const setFilterAndReload = (f) => setFilter(f);

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou auteur..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => loadBooks()}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity style={[styles.chip, filter === 'all' && styles.chipSelected]} onPress={() => setFilterAndReload('all')}>
            <Text style={filter === 'all' ? styles.chipTextSelected : styles.chipText}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chip, filter === 'read' && styles.chipSelected]} onPress={() => setFilterAndReload('read')}>
            <Text style={filter === 'read' ? styles.chipTextSelected : styles.chipText}>Lus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chip, filter === 'unread' && styles.chipSelected]} onPress={() => setFilterAndReload('unread')}>
            <Text style={filter === 'unread' ? styles.chipTextSelected : styles.chipText}>Non lus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chip, filter === 'favorite' && styles.chipSelected]} onPress={() => setFilterAndReload('favorite')}>
            <Text style={filter === 'favorite' ? styles.chipTextSelected : styles.chipText}>Favoris</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.sortRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}}>
            <View style={styles.sortButtonsContainer}>
              <TouchableOpacity style={[styles.sortButton, sortField === 'name' && styles.sortSelected]} onPress={() => setSortField('name')}>
                <Text style={sortField === 'name' ? styles.sortSelectedText : styles.sortText}>Titre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sortButton, sortField === 'author' && styles.sortSelected]} onPress={() => setSortField('author')}>
                <Text style={sortField === 'author' ? styles.sortSelectedText : styles.sortText}>Auteur</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sortButton, sortField === 'theme' && styles.sortSelected]} onPress={() => setSortField('theme')}>
                <Text style={sortField === 'theme' ? styles.sortSelectedText : styles.sortText}>Thème</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.sortOrderButton} onPress={toggleSortOrder}>
            <Ionicons name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
            onToggleRead={handleToggleRead}
            onToggleFavorite={handleToggleFavorite}
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
  searchContainer: {
    padding: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textLight,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  sortSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortText: {
    color: colors.textLight,
    fontWeight: '600',
  },
  sortSelectedText: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  sortOrderButton: {
    padding: 8,
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