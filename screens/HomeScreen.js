import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://fiyasko-blog-api.vercel.app/homePosts"
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Blog postları alınırken hata:", error);
      Alert.alert("Hata", "Blog postları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderBlogPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCardContainer}
      onPress={() => navigation.navigate("BlogDetail", { postId: item._id })}
    >
      <View style={styles.postCard}>
        <Image source={{ uri: item.cover }} style={styles.postImage} />
        <View style={styles.postMeta}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfileScreen", {
                userData: item.author,
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.date}>Yazar:</Text>
              <Text style={styles.author}> {item.author?.username}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.postContent}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{item.PostTags}</Text>
          </View>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postSummary} numberOfLines={3}>
            {item.summary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Blog postları yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderBlogPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  postCardContainer: {
    marginBottom: 16,
    borderBottomColor: "#6a67ce",
    borderBottomWidth: 1,
  },
  postCard: {
    backgroundColor: "#333",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 5,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  postContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    backgroundColor: "#ffc107",
    color: "#000",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 28,
  },
  postSummary: {
    fontSize: 14,
    color: "#f9f9f9",
    marginBottom: 12,
    lineHeight: 20,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    margin: 0,
  },
  author: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    textTransform: "capitalize",
    maxWidth: "80%",
  },
  date: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
