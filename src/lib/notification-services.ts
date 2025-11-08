'use client';

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Notification } from './types';

type NotificationInput = Omit<Notification, 'id' | 'createdAt' | 'isRead'>;

export async function createNotification(notification: NotificationInput) {
  if (!db) {
    console.error("Firestore is not initialized.");
    return;
  }

  try {
    const notificationsRef = collection(db, 'users', notification.userId, 'notifications');
    await addDoc(notificationsRef, {
      ...notification,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating notification: ", error);
    // Optionally, you can re-throw the error or handle it as needed
    // For example, using a global error handler or toast notification
  }
}
