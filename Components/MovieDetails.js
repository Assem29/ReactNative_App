import React from "react";
import { View, StyleSheet, Text} from "react-native";
import { Appbar, Card, Title, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const MovieDetails = ({ navigation, route }) => {
  const { movie } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.titleContainer}>
          <Ionicons name="chevron-back" size={24} color="black" onPress={goBack} />

          <View style={styles.titleWrapper}>
          </View>
        </View>
      </Appbar.Header>
      <Card style={styles.card}>
  <Card.Cover
    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
    resizeMode="contain"
  />
  <View style={styles.cardContent}>
    <Card.Content>
    <Title style={styles.title}>{movie.title}</Title>
      <Paragraph style={styles.overview}>{movie.overview}</Paragraph>
    </Card.Content>
  </View>
  <Card.Actions>
    <View style={styles.review}>
      <Ionicons name="star" size={20} color="orange" />
      <Text style={styles.rating}>{movie.vote_average}/10</Text>
    </View>
  </Card.Actions>
</Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  card: {
    margin: 16,
  },
  
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  overview: {
    fontSize: 16,
    textAlign: "center",
  },
  review: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rating: {
    marginLeft: 8,
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center",
  },
  
});
export default MovieDetails;
