import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const Paso4Jugador = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const manipulatedImage = await manipulateAsync(
        photo.uri,
        [{ rotate: 0 }], // No rotation, just to fix orientation
        { format: SaveFormat.JPEG }
      );
      setImageUri(manipulatedImage.uri);
      setShowCamera(false);
    }
  };

  const openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const manipulatedImage = await manipulateAsync(
        pickerResult.uri,
        [{ rotate: 0 }], // No rotation, just to fix orientation
        { format: SaveFormat.JPEG }
      );
      setImageUri(manipulatedImage.uri);
    }
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton} />
          </View>
        </Camera>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setShowCamera(true)}>
            <Text>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openImagePickerAsync}>
            <Text>Select Image from Gallery</Text>
          </TouchableOpacity>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  captureButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default Paso4Jugador;
