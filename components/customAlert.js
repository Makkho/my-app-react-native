import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import colors from '../constants/colors';

const CustomAlert = ({ visible, title, message, onConfirm, onCancel, confirmText = 'OK', cancelText }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            {onCancel && (
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
                <Text style={styles.buttonText}>{cancelText || 'Annuler'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: colors.card || '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text || '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textLight || '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirm: {
    backgroundColor: colors.primary || '#007bff',
  },
  cancel: {
    backgroundColor: colors.danger || '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomAlert;
