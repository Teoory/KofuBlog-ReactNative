import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";

export default function BlogDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, []);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(
        `https://fiyasko-blog-api.vercel.app/post/${postId}`
      );
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Blog detayı alınırken hata:", error);
      Alert.alert("Hata", "Blog detayı yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://fiyasko-blog-api.vercel.app/post/${postId}/comments`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Yorumlar alınırken hata:", error);
      Alert.alert("Hata", "Yorumlar yüklenirken bir hata oluştu.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const commentFormatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const openKofuWebsite = () => {
    Linking.openURL("https://kofu.com.tr").catch((err) =>
      console.error("URL açılırken hata:", err)
    );
  };

  const tagsStyles = {
    body: {
      color: "#fff",
      fontSize: 16,
      lineHeight: 24,
    },
    h1: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 16,
      color: "#fff",
    },
    h2: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 14,
      color: "#fff",
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 12,
      color: "#fff",
    },
    p: {
      marginVertical: 8,
      textAlign: "justify",
    },
    a: {
      color: "#007AFF",
    },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Blog yükleniyor...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Blog bulunamadı.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View> */}

      <Image source={{ uri: post.cover }} style={styles.coverImage} />

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.author}>Yazar: {post.author?.username}</Text>
          <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{post.PostTags}</Text>
          </View>
        </View>

        <Text style={styles.summary}>{post.summary}</Text>

        <View style={styles.htmlContent}>
          <RenderHtml
            contentWidth={width - 40}
            source={{ html: post.content }}
            tagsStyles={tagsStyles}
          />
        </View>

        <View style={styles.commentsArea}>
          <Text style={styles.commentsTitle}>Yorumlar ({comments.length})</Text>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment._id} style={styles.comment}>
                <View style={styles.commentTop}>
                  <TouchableOpacity
                    style={styles.commentAuthorInfo}
                    onPress={() =>
                      navigation.navigate("ProfileScreen", {
                        userData: comment.author,
                      })
                    }
                  >
                    <Image
                      source={{
                        uri:
                          comment.author?.profilePhoto ||
                          "https://via.placeholder.com/40",
                      }}
                      style={styles.commentAuthorImage}
                    />
                    <Text style={styles.commentAuth}>Yazar:</Text>
                    <Text style={styles.commentAuthor}>
                      {comment.author?.username || "Anonim"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.commentDate}>
                    {commentFormatDate(comment.createdAt)}
                  </Text>
                </View>

                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>Henüz yorum yok.</Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={openKofuWebsite}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Yorum Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.likeButton} onPress={openKofuWebsite}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Beğen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#b37024",
    elevation: 2,
  },
  backIconButton: {
    padding: 8,
  },
  coverImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#b37024",
    marginBottom: 16,
    lineHeight: 34,
  },
  metaInfo: {
    marginBottom: 20,
  },
  author: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#696969",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#ffc107",
    color: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  summary: {
    fontSize: 18,
    color: "#f9f9f9",
    marginBottom: 24,
    fontStyle: "italic",
    lineHeight: 26,
  },
  htmlContent: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
    gap: 12,
  },
  commentButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  likeButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  statsText: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#b37024",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#0f0f0f",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  commentsArea: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  noComments: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
  },
  comment: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderColor: "#6a67ce",
    borderWidth: 1,
  },
  commentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 4,
  },
  commentAuthorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "80%",
    maxWidth: "80%",
  },
  commentAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  commentAuth: {
    fontSize: 10,
    color: "#333",
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
    marginLeft: -6,
    width: 100,
  },
  commentDate: {
    fontSize: 12,
    color: "#666",
    width: "20%",
  },
});
