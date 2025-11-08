'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Notification } from '@/lib/types';
import { toast } from 'sonner';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const notificationsQuery = useMemo(() => {
    if (!db || !userId) return null;
    return query(
      collection(db, 'users', userId, 'notifications'),
      orderBy('createdAt', 'desc')
    );
  }, [userId]);

  useEffect(() => {
    if (!notificationsQuery) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
        setNotifications(notifs);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        toast.error('Could not fetch notifications.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [notificationsQuery]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const markAsRead = async (notificationId: string) => {
    if (!db || !userId) return;
    const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
    try {
      await updateDoc(notifRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!db || !userId || unreadCount === 0) return;
    const batch = writeBatch(db);
    notifications.forEach(notif => {
        if (!notif.isRead) {
            const notifRef = doc(db, 'users', userId, 'notifications', notif.id);
            batch.update(notifRef, { isRead: true });
        }
    });
    try {
        await batch.commit();
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        toast.error('Could not mark all notifications as read.');
    }
  };

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead };
}
