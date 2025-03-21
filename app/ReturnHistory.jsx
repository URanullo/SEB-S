import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getReturnHistory } from './storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from './theme';

const ReturnHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getReturnHistory();
    setHistory(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Return History</Text>

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.equipmentText}>🔹 {item.name} - {item.type}</Text>
            <Text style={styles.dateText}>
              🕒 Returned: {new Date(item.returnedAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={50} color={colors.gray} />
            <Text style={styles.emptyText}>No return history available.</Text>
          </View>
        }
      />
    </View>
  );
};

export default ReturnHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.primary,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: colors.accent,
    borderWidth: 1,
  },
  equipmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.primary,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 5,
    fontFamily: fonts.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.primary,
  },
});
