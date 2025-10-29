import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
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
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

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
      // charger les notes associées
      loadNotes();
    } catch (err) {
      console.error('Erreur de chargement :', err);
      showInfoAlert(`Erreur : ${err.message}`);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      setNotesLoading(true);
      const data = await bookService.getBookNotes(bookId);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement notes :', err);
      // ne pas bloquer l'affichage principal
    } finally {
      setNotesLoading(false);
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

  const handleToggleFavorite = async () => {
    if (!book) return;
    try {
      setLoading(true);
      await bookService.toggleFavorite(book.id, book.favorite);
      await loadBook();
      emitEvent('books:changed');
    } catch (err) {
      console.error('Toggle favorite error', err);
      showInfoAlert('Impossible de changer le statut favori');
    } finally {
      setLoading(false);
    }
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

  const handleAddNote = async () => {
    const content = newNote.trim();
    if (!content) return showInfoAlert('La note est vide.');
    try {
      setAddingNote(true);
      await bookService.addBookNote(bookId, content);
      setNewNote('');
      await loadNotes();
      emitEvent('books:changed');
    } catch (err) {
      console.error('Erreur ajout note :', err);
      showInfoAlert('Impossible d\'ajouter la note.');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du livre..." />;
  }

  if (!book) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {book.coverImage ? (
        <View style={styles.coverImageContainer}>
          <Image source={{ uri: book.coverImage }} style={styles.coverImage} resizeMode="contain" />
        </View>
      ) : (
        <View style={[styles.coverImageContainer, styles.noCoverContainer]}>
          <Ionicons name="book-outline" size={100} color={colors.textLight} />
          <Text style={styles.noCoverText}>Pas de couverture</Text>
        </View>
      )}
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
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name={book.favorite ? 'heart' : 'heart-outline'} size={22} color={book.favorite ? colors.danger : colors.textWhite} />
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
      {/* Section Notes */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notes</Text>

        {notesLoading ? (
          <Text style={styles.infoValue}>Chargement des notes...</Text>
        ) : (
          <View>
            {notes.length === 0 ? (
              <Text style={styles.infoValue}>Aucune note pour ce livre.</Text>
            ) : (
              notes.map((n) => (
                <View key={n.id || n._id || Math.random()} style={styles.noteRow}>
                  <Text style={styles.noteContent}>{n.content || n.text || n.body}</Text>
                  <Text style={styles.noteDate}>{(n.createdAt || n.date) ? new Date(n.createdAt || n.date).toLocaleString() : ''}</Text>
                </View>
              ))
            )}

            <View style={styles.addNoteRow}>
              <TextInput
                style={styles.noteInput}
                placeholder="Ajouter un commentaire..."
                value={newNote}
                onChangeText={setNewNote}
                editable={!addingNote}
                multiline
              />
              <TouchableOpacity
                style={[styles.addNoteButton, addingNote && { opacity: 0.6 }]}
                onPress={handleAddNote}
                disabled={addingNote}
              >
                <Text style={styles.addNoteButtonText}>{addingNote ? 'Ajout...' : 'Ajouter'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  coverImageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: colors.background,
    padding: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  noCoverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
  },
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
  noteRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noteContent: {
    color: colors.text,
    fontSize: 15,
    marginBottom: 4,
  },
  noteDate: {
    color: colors.textLight,
    fontSize: 12,
  },
  addNoteRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  noteInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  addNoteButton: {
    marginLeft: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookDetailsScreen;
