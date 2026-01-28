import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { username, signOut } = useAuth();

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      {username ? (
        <>
          <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>
            Hello, {username}!
          </Text>
          <Text style={StyleSheet.flatten([styles.subtitle, { color: colors.text }])}>
            Welcome back to Posu.
          </Text>

          <TouchableOpacity
            style={StyleSheet.flatten([styles.button, { backgroundColor: colors.tint, marginTop: 20 }])}
            onPress={signOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>
            Hello!
          </Text>
          <Text style={StyleSheet.flatten([styles.subtitle, { color: colors.text }])}>
            Please connect to access all features.
          </Text>

          <Link href="/auth/signin" asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.button, { backgroundColor: colors.tint, marginTop: 20 }])}>
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
          </Link>
        </>
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
