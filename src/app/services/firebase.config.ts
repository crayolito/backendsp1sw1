import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCH8hzRr9TVq7mUkMtYZHC8kwuacQIC0Zs',
  authDomain: 'react-netflix-clone-902ce.firebaseapp.com',
  projectId: 'react-netflix-clone-902ce',
  storageBucket: 'react-netflix-clone-902ce.appspot.com',
  messagingSenderId: '532939006301',
  appId: '1:532939006301:web:8ea38fae284024dbdbc8b4',
  measurementId: 'G-RVPT1EBM4Z',
};
const firebaseAppProvider = provideFirebaseApp(() =>
  initializeApp(firebaseConfig)
);
const authProvider = provideAuth(() => getAuth());

const firebaseProviders: EnvironmentProviders = importProvidersFrom(
  firebaseAppProvider,
  authProvider
);

export { firebaseProviders };
