import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";

const ProfileScreen = ({ route, navigation }) => {
  const { userData } = route.params || {};
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://fiyasko-blog-api.vercel.app/profile/${userData.username}`
        );
        const data = await response.json();
        setUserDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Kullanıcı verileri alınırken hata:", error);
        Alert.alert("Hata", "Kullanıcı verileri yüklenirken bir hata oluştu.");
      }
    };
    if (userData && userData?.username) {
      fetchUserData();
    }
  }, [userData]);

  const renderBlogPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCardContainer}
      onPress={() => navigation.navigate("BlogDetail", { postId: item._id })}
    >
      <View style={styles.postCard}>
        <Image source={{ uri: item.cover }} style={styles.postImage} />
        <View style={styles.postMeta}></View>
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#222",
          gap: 20,
        }}
      >
        <ActivityIndicator size="large" color="#b37024" />
        <Text style={styles.profileTitle}>
          Kullanıcı bilgileri yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.UserInfoContainer}>
        <Text style={styles.profileTitle}>Profil</Text>
        {userDetails && userDetails?.user?.profilePhoto ? (
          <View style={styles.ProfileCard}>
            <Image
              source={{
                uri:
                  userDetails.user.profilePhoto ||
                  "https://example.com/default-avatar.png",
              }}
              style={styles.profileImage}
            />
            <View style={styles.subtitle}>
              <Text style={styles.username}>{userData.username}</Text>
              {userDetails && userDetails?.user?.email && (
                <Text style={styles.email}>{userDetails.user.email}</Text>
              )}
              <Text style={userDetails?.user.tags.includes("admin") ? styles.adminTags : styles.tags}>
                {userDetails?.user?.tags[0]}
                {userDetails?.user?.tags[1]
                  ? `, ${userDetails.user.tags[1]}`
                  : ""}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.subtitle}>Kullanıcı bilgileri mevcut değil.</Text>
        )}
      </View>

      <Text style={styles.profileTitle}>Hakkında</Text>
      <View style={styles.bioContainer}>
        {userDetails?.user?.bio ? (
          <Text style={styles.bioText}>{userDetails.user.bio}</Text>
        ) : (
          <Text style={styles.bioText}>Bu kullanıcı hakkında bilgi yok.</Text>
        )}
      </View>

      <Text style={styles.profileTitle}>Paylaşımlar</Text>
      <View>
        {userDetails?.posts && userDetails.posts.length > 0 ? (
          userDetails.posts.map((post) => (
            <FlatList
              data={userDetails?.posts}
              renderItem={renderBlogPost}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ))
        ) : (
          <Text style={styles.bioText}>
            Bu kullanıcı henüz paylaşım yapmadı.
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    paddingVertical: 5,
  },
  UserInfoContainer: {
    alignItems: "start",
    justifyContent: "start",
    paddingVertical: 10,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  ProfileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 6,
    width: "80%",
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#b37024",
  },
  subtitle: {
    color: "#333",
    fontSize: 16,
    textAlign: "flex-start",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f32170",
    marginBottom: 4,
    width: "100%",
    textAlign: "flex-start",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    width: "100%",
  },
  tags: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    width: "100%",
  },
  adminTags: {
    fontSize: 14,
    color: "#1991a1",
    fontWeight: "bold",
    textTransform: "uppercase",
    width: "100%",
  },
  bioContainer: {
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 6,
    height: 100,
    justifyContent: "start",
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 10,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 500,
    backgroundColor: "#222",
    borderTopColor: "#6a67ce",
    borderTopWidth: 1,
    borderBottomColor: "#6a67ce",
    borderBottomWidth: 1,
    borderRadius: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  postCardContainer: {
    marginBottom: 16,
    borderBottomColor: "#6a67ce",
    borderBottomWidth: 1,
  },
  postCard: {
    backgroundColor: "#222",
    borderRadius: 4,
    marginBottom: 16,
    elevation: 0,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    margin: 0,
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
});
