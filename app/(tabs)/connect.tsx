import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ConnectScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>Welcome</Text>
      <Text style={StyleSheet.flatten([styles.subtitle, { color: colors.text }])}>
        Please sign in or sign up to continue.
      </Text>

      <View style={styles.buttonContainer}>
        <Link href="/auth/signin" asChild>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, { backgroundColor: colors.tint }])}>
            <Text style={StyleSheet.flatten([styles.buttonText, { color: colors.background }])}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/signup" asChild>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.tint }])}>
            <Text style={StyleSheet.flatten([styles.buttonText, { color: colors.tint }])}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
