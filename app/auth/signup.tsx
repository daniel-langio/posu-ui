import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      console.log('Attempting registration for:', data.username);
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Failed to sign up';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_e) {
          const textError = await response.text().catch(() => '');
          errorMessage = textError || `Server returned ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Registration response received:', !!result);

      if (!result.apiKey) {
        throw new Error('No API key received from server');
      }

      const userToSave = result.username || data.username;
      console.log('Saving session for:', userToSave);
      await signIn(userToSave, result.apiKey);

      console.log('Session saved, redirecting to home...');
      router.replace('/');

      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Account created successfully!');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'An unexpected error occurred';
      if (error.name === 'AbortError') {
        message = 'Request timed out. Please try again.';
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      Alert.alert('Sign Up Error', message);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>Sign Up</Text>

      <View style={styles.form}>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorContainerText}>{errorMessage}</Text>
          </View>
        )}
        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={StyleSheet.flatten([styles.input, { color: colors.text, borderColor: colors.icon }])}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Enter your username"
              placeholderTextColor={colors.icon}
            />
          )}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={StyleSheet.flatten([styles.input, { color: colors.text, borderColor: colors.icon }])}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor={colors.icon}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Text style={StyleSheet.flatten([styles.label, { color: colors.text }])}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={StyleSheet.flatten([styles.input, { color: colors.text, borderColor: colors.icon }])}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={colors.icon}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <TouchableOpacity
          style={StyleSheet.flatten([styles.button, { backgroundColor: colors.tint }])}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ActivityIndicator color={colors.background} />
              <Text style={StyleSheet.flatten([styles.buttonText, { color: colors.background }])}>Signing Up...</Text>
            </View>
          ) : (
            <Text style={StyleSheet.flatten([styles.buttonText, { color: colors.background }])}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{ color: colors.text }}>Already have an account? </Text>
          <Link href="/auth/signin" asChild>
            <TouchableOpacity>
              <Text style={StyleSheet.flatten([styles.link, { color: colors.tint }])}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
    marginBottom: 10,
  },
  errorContainerText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    fontWeight: 'bold',
  },
});
