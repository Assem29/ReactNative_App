import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import { Appbar } from "react-native-paper";
import * as yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  phone: yup.number().required("Phone number is required"),
});

const ProfileScreen = () => {
  const [hidePassword, setHidePassword] = useState(true);

  const handleLogin = (values) => {
    alert(JSON.stringify(values));
  };
  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <>
      <Appbar style={styles.appbar}>
        <Appbar.Content title="LOGIN" titleStyle={styles.title} />
        <Appbar.Action
          icon={() => <Ionicons name="call" size={24} color="black" />}
          onPress={() => console.log("Call")}
        />
      </Appbar>

      <View style={styles.container}>
        <Formik
          initialValues={{ username: "", password: "", email: "", phone: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ values, handleChange, errors, touched, handleSubmit }) => (
            <>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("username")}
                value={values.username}
                placeholder="Username"
              />
              {touched.username && errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}
              <View style={styles.passwordContainer}>
                <TextInput
                  onChangeText={handleChange("password")}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry={hidePassword}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={togglePasswordVisibility}
                >
                  <Icon
                    name={hidePassword ? "eye-off" : "eye"}
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>

              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={handleChange("email")}
                value={values.email}
                placeholder="Email"
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={handleChange("phone")}
                value={values.phone}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
              {touched.phone && errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}
              <View style={styles.buttonContainer}>
                <Text style={styles.button} onPress={handleSubmit}>
                  Login
                </Text>
              </View>
            </>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "80%",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
  appbar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000'
  }
});

export default ProfileScreen;
