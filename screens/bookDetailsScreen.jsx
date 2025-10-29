import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bookService from '../services/bookService';
import { emit as emitEvent } from '../services/eventBus';
import LoadingSpinner from '../components/loadingSpinner';
import CustomAlert from '../components/customAlert';
import colors from '../constants/colors';

const BookDetailsScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pour afficher notre alerte custom
  const [alertData, setAlertData] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showStyledAlert = (message, onConfirm) => {
    setAlertData({
      visible: true,
      title: 'Confirmation',
      message,
      onConfirm: () => {
        setAlertData({ visible: false });
        if (onConfirm) onConfirm();
      },
      onCancel: () => setAlertData({ visible: false }),
    });
  };

  const showInfoAlert = (message) => {
    setAlertData({
      visible: true,
      title: 'Information',
      message,
      onConfirm: () => setAlertData({ visible: false }),
      onCancel: null,
    });
  };

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBookById(bookId);
      setBook(data);
    } catch (err) {
      console.error('Erreur de chargement :', err);
      showInfoAlert(`Erreur : ${err.message}`);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async () => {
    try {
      await bookService.toggleReadStatus(book.id, book.read);
      await loadBook();
    } catch (err) {
      console.error('Erreur changement statut :', err);
      showInfoAlert(`Erreur : ${err.message}`);
    }
  };

  const handleEdit = () => {
    navigation.navigate('BookForm', { book });
  };

  const handleDelete = async () => {
    if (!book) return;

    showStyledAlert(`Voulez-vous vraiment supprimer "${book.name}" ?`, async () => {
      try {
        setLoading(true);
        await bookService.deleteBook(book.id);
        emitEvent('books:changed');
        showInfoAlert('Livre supprimé avec succès.');
        navigation.navigate('BookList');
      } catch (err) {
        console.error('Erreur suppression :', err);
        showInfoAlert('Erreur lors de la suppression du livre.');
      } finally {
        setLoading(false);
      }
    });
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du livre..." />;
  }

  if (!book) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: book.read ? colors.successLight : colors.warningLight },
            ]}
            onPress={handleToggleRead}
          >
            <Ionicons
              name={book.read ? 'checkmark-circle' : 'time-outline'}
              size={24}
              color={book.read ? colors.success : colors.warning}
            />
            <Text
              style={[
                styles.statusText,
                { color: book.read ? colors.success : colors.warning },
              ]}
            >
              {book.read ? 'Lu' : 'Non lu'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{book.name}</Text>
        <Text style={styles.author}>{book.author}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
            <Text style={styles.infoLabelText}>Éditeur</Text>
          </View>
          <Text style={styles.infoValue}>{book.publisher || 'Non renseigné'}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.infoLabelText}>Année</Text>
          </View>
          <Text style={styles.infoValue}>{book.year || 'Non renseignée'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color={colors.textWhite} />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color={colors.textWhite} />
          <Text style={styles.deleteButtonText}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔔 Alerte stylisée */}
      <CustomAlert
        visible={alertData.visible}
        title={alertData.title}
        message={alertData.message}
        onConfirm={alertData.onConfirm}
        onCancel={alertData.onCancel}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BookDetailsScreen;
