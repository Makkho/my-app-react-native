import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const BookCard = ({ book, onPress, onToggleRead }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {book.name}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.statusBadge,
            { backgroundColor: book.read ? colors.successLight : colors.warningLight }
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onToggleRead(book);
          }}
        >
          <Ionicons
            name={book.read ? 'checkmark-circle' : 'time-outline'}
            size={20}
            color={book.read ? colors.success : colors.warning}
          />
          <Text
            style={[
              styles.statusText,
              { color: book.read ? colors.success : colors.warning }
            ]}
          >
            {book.read ? 'Lu' : 'Non lu'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        {book.publisher && (
          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={16} color={colors.textLight} />
            <Text style={styles.detailText}>{book.publisher}</Text>
          </View>
        )}
        
        {book.year && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
            <Text style={styles.detailText}>{book.year}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'flex-end',
  },
});

export default BookCard;