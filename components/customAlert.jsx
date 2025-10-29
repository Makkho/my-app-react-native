import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const CustomAlert = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal transparent visible={!!visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {onCancel ? (
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    color: colors.textLight,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancel: {},
  confirm: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    color: colors.text,
    fontWeight: '600',
  },
  confirmText: {
    color: colors.textWhite,
    fontWeight: '700',
  },
});

export default CustomAlert;
