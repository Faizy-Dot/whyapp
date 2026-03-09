import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import axiosInstance from "../../../config/axios";

export default function RequestsScreen() {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [incomingRes, sentRes] = await Promise.all([
        axiosInstance.get("/friendRequest/incoming"),
        axiosInstance.get("/friendRequest/sent"),
      ]);

      setRequests(incomingRes.data.requests || []);
      setSentRequests(sentRes.data.sentRequests || []);
    } catch (error) {
      console.log("Error fetching requests:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle actions
  const handleAction = async (id, type, tab) => {
    try {
      let url = "";
      if (type === "accept") url = `/friendRequest/accept/${id}`;
      if (type === "cancel") url = `/friendRequest/cancel/${id}`;
      if (type === "delete") url = `/friendRequest/delete/${id}`;

      await axiosInstance.post(url);

      // Update UI locally
      if (tab === "requests") {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, status: type === "accept" ? "accepted" : type }
              : r
          )
        );
      } else {
        setSentRequests((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, status: type === "accept" ? "accepted" : type }
              : r
          )
        );
      }
    } catch (error) {
      console.log("Error action:", error.response?.data || error.message);
    }
  };

  const renderIncomingItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "green" }]}
          disabled={item.status === "accepted"}
          onPress={() => handleAction(item._id, "accept", "requests")}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "orange" }]}
          disabled={item.status === "cancel"}
          onPress={() => handleAction(item._id, "cancel", "requests")}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: item.status === "cancel" ? "red" : "gray" },
          ]}
          disabled={item.status !== "cancel"}
          onPress={() => handleAction(item._id, "delete", "requests")}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSentItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text>Status: {item.status || "pending"}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "orange" }]}
          disabled={item.status === "cancel"}
          onPress={() => handleAction(item._id, "cancel", "sent")}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: item.status === "cancel" ? "red" : "gray" },
          ]}
          disabled={item.status !== "cancel"}
          onPress={() => handleAction(item._id, "delete", "sent")}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.activeTab]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "sent" && styles.activeTab]}
          onPress={() => setActiveTab("sent")}
        >
          <Text style={styles.tabText}>Sent Requests</Text>
        </TouchableOpacity>
      </View>

      {/* Lists */}
      {loading ? (
        <Text>Loading...</Text>
      ) : activeTab === "requests" ? (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderIncomingItem}
          ListEmptyComponent={<Text>No incoming requests</Text>}
        />
      ) : (
        <FlatList
          data={sentRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderSentItem}
          ListEmptyComponent={<Text>No sent requests</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "blue",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
