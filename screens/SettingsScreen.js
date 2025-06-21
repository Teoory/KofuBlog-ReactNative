import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={80} color="#007AFF" />
      </View>
      <Text style={styles.title}>Ayarlar</Text>
      <Text style={styles.subtitle}>Bu sayfa geliştirme aşamasındadır.</Text>
      <Text style={styles.description}>
        Yakında burada uygulama ayarlarını yönetebileceksiniz.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#f9f9f9",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#c9c9c9",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
});
