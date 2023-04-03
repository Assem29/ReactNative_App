import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";
import { Dialog, Paragraph, Button, Checkbox } from "react-native-paper";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingText, setEditingText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    AsyncStorage.getItem("todos").then((data) => {
      if (data !== null) {
        setTodos(JSON.parse(data));
      }
    });
  }, []);

  const addTodo = () => {
    if (text !== "") {
      const newTodo = { id: Date.now(), text };
      setTodos([...todos, newTodo]);
      AsyncStorage.setItem("todos", JSON.stringify([...todos, newTodo]));
      setText("");
    }
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    AsyncStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const editTodo = () => {
    const index = todos.findIndex((todo) => todo.id === editingId);
    todos[index].text = editingText;
    setTodos([...todos]);
    AsyncStorage.setItem("todos", JSON.stringify(todos));
    handleHideModal();
  };
  const handleTaskCompletion = (taskId, completed) => {
    const newTodos = todos.filter((todo) => {
      if (todo.id === taskId) {
        todo.completed = completed;
      }
      return !completed || todo.id !== taskId;
    });
    setTodos(newTodos);
  };

  const handleShowModal = () => {
    setShowModal(true);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleHideModal = () => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  const handleShowListDialog = () => {
    setShowListDialog(true);
  };

  const handleHideListDialog = () => {
    setShowListDialog(false);
  };
  const EmptyList = () => (
    <View style={styles.emptyListContainer}>
      <LottieView
        source={{
          uri: `https://assets7.lottiefiles.com/packages/lf20_mf5j5kua.json`,
        }}
        autoPlay
        loop
        style={styles.emptyListAnimation}
      />
      <Text style={styles.emptyListText}>Nothing to do!</Text>
    </View>
  );
  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.text}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonEdit}
          onPress={() => {
            setEditingId(item.id);
            setEditingText(item.text);
            handleShowModal();
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => deleteTodo(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ToDo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add todo"
          onChangeText={setText}
          value={text}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {todos.length === 0 ? (
        <EmptyList />
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal visible={showModal} animationType="fade" transparent>
        <Animated.View
          style={[styles.modalContainer, { opacity: modalOpacity }]}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.inputEdit}
              placeholder="Edit todo"
              onChangeText={setEditingText}
              value={editingText}
            />
            <TouchableOpacity style={styles.button} onPress={editTodo}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={handleHideModal}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
      <Dialog visible={showListDialog} onDismiss={handleHideListDialog}>
        <Dialog.Title>Todo List</Dialog.Title>
        <Dialog.Content>
          {todos.length > 0 ? (
            <FlatList
              data={todos}
              renderItem={({ item }) => (
                <View style={styles.dialogItem}>
                  <Paragraph style={styles.dialogText}>{item.text}</Paragraph>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                      status={item.completed ? "checked" : "unchecked"}
                      onPress={() =>
                        handleTaskCompletion(item.id, !item.completed)
                      }
                    />
                    <Text>{item.completed ? "Completed" : "Incomplete"}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Paragraph style={styles.dialogText}>No todos added yet</Paragraph>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleHideListDialog}>Close</Button>
        </Dialog.Actions>
      </Dialog>

      <Button
        mode="contained"
        onPress={handleShowListDialog}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Show List ({todos.length})
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    marginRight: 8,
  },
  inputEdit: {
    height: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    marginRight: 8,
    marginTop: 10,
  },
  buttonAdd: {
    backgroundColor: "blue",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  buttonEdit: {
    backgroundColor: "green",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  buttonDelete: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    minWidth: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: "gray",
  },
  dialogItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dialogText: {
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "blue",
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
    marginLeft: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListAnimation: {
    width: 200,
    height: 200,
  },
  emptyListText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});
export default TodoList;
