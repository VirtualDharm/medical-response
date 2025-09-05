// types/expo-router.d.ts
import * as Router from 'expo-router';

declare module 'expo-router' {
  export type RelativePathString =
    | '/'
    | '/(auth)'
    | '/(auth)/signin'
    | '/(auth)/signup'
    | '/(auth)/face-signin'
    | '/(auth)/face-signup'
    | '/(tabs)'
    | '/(tabs)/index'
    | '/(tabs)/notifications'
    | '/(tabs)/profile'
    | '/+not-found';
}