import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Button } from "react-native-elements";
import { Appbar, Card, Title, Paragraph } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import ImageSlider from "react-native-image-slider";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=aa6fc65fcedb7431af3ac2fbe6484cd0&language=en-US&page=${page}`
      )
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const showMovieDetails = (movie) => {
    navigation.navigate("MovieDetail", { movie });
  };
  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const images = [
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60",
    "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
    "https://images.unsplash.com/photo-1512070800540-0d4192faa057?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
    "https://source.unsplash.com/1600x900/?cityscape,night",
    "https://source.unsplash.com/1600x900/?stars,sky",
  ];

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" />
        <Appbar.Content title="Movie DB" titleStyle={{ alignSelf: "center" }} />
        <Appbar.Action icon="bell" />
      </Appbar.Header>
      <View style={styles.sliderContainer}>
        <ImageSlider
          loopBothSides
          autoPlayWithInterval={1000}
          images={images}
        />
      </View>

      <View style={styles.cardContainer}>
        {movies.map((movie) => (
          <Card
            key={movie.id}
            style={styles.card}
            onPress={() => showMovieDetails(movie)}
          >
            <Card.Cover
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              resizeMode="contain"
            />
            {movie.vote_average > 7 && (
              <Icon name="heart" size={24} style={styles.heartIcon} />
            )}
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{movie.vote_average}</Text>
            </View>
            <Card.Content>
              <Title>{movie.title}</Title>
              <Paragraph>{`${movie.overview.substring(0, 100)}...`}</Paragraph>
            </Card.Content>
          </Card>
        ))}
        <Button
          title="Load more"
          onPress={handleLoadMore}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    position: "relative",
  },

  ratingContainer: {
    position: "absolute",
    top: 10,
    right: 16,
    backgroundColor: "blue",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  rating: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  sliderContainer: {
    height: 200,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    left: 16,
    color: "red",
    zIndex: 1,
  },
  loadMoreButtonContainer: {
    margin: 16,
    alignItems: "center",
  },
  button: {
    backgroundColor: "purple",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default Home;
