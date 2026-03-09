import { StyleSheet } from 'react-native';
import Metrix from '../../../config/Metrix';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Metrix.HorizontalSize(20),
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: Metrix.FontExtraLarge,
    fontWeight: 'bold',
    marginBottom: Metrix.VerticalSize(30),
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: Metrix.VerticalSize(20),
    paddingVertical: Metrix.VerticalSize(5),
  },
  input: {
    marginLeft: Metrix.HorizontalSize(10),
    flex: 1,
    fontSize: Metrix.FontRegular,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: Metrix.VerticalSize(12),
    borderRadius: Metrix.Radius,
    marginTop: Metrix.VerticalSize(10),
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: Metrix.FontMedium,
  },
  googleButton: {
    width: '100%',
    height: Metrix.VerticalSize(48),
    marginBottom: Metrix.VerticalSize(20),
  },
  registerText: {
    color: '#4a90e2',
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(20),
    fontSize: Metrix.FontSmall,
  },
});

export default styles;
