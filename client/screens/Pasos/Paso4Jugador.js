import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Color,
  FontFamily,
  FontSize,
  Border,
  Padding,
} from '../../GlobalStyles';
import DetallesSeleccion from '../../components/DetallesSeleccion';
import { Context } from '../../context/Context';
import { Entypo } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { manipulateAsync } from 'expo-image-manipulator';

const Paso4Jugador = ({
  sportmanValues,
  setSportmanValues,
  setSelectedCity,
  selectedCity,
  selectedSport,
}) => {
  const {
    pickImage,
    provisoryProfileImage,
    pickImageFromCamera,
    provisoryCoverImage,
  } = useContext(Context);

  const [facing, setFacing] = useState('back');
  const [showCamera, setShowCamera] = useState(false);
  const [sportColor, setSportColor] = useState('');

  const [selectedPicture, setSelectedPicture] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const cameraReff = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    if (selectedSport.name == 'Fútbol Sala') {
      setSportColor('#0062FF');
    }
    if (selectedSport.name == 'Hockey') {
      setSportColor('#E1AA1E');
    }
    if (selectedSport.name == 'Voley') {
      setSportColor('#A8154A');
    }
    if (selectedSport.name == 'Handball') {
      setSportColor('#6A1C4F');
    }
    if (selectedSport.name == 'Fútbol') {
      setSportColor('#00FF18');
    }
    if (selectedSport.name == 'Básquetbol') {
      setSportColor('#E1451E');
    }
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const changePictureMode = async () => {
    setFacing((prev) => (prev == 'back' ? 'front' : 'back'));
  };

  useEffect(() => {}, [selectedImage, selectedPicture]);

  const takePicture = async () => {
    if (cameraReff?.current) {
      const photo = await cameraReff.current.takePictureAsync();
      
      const manipulatedImage = await manipulateAsync(
        photo.uri,
        [{ rotate: 90 }], // Rotate the image by 90 degrees if taken horizontally
        { compress: 1, format: 'jpeg' }
      );

      setSelectedImage(manipulatedImage);
      pickImageFromCamera(selectedPicture, manipulatedImage.uri);
      setShowCamera(false);
    }
  };

  const [scrolledHeight, setScrolledHeight] = useState(0);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const height = contentOffset.y;
    setScrolledHeight(height);
  };

  if (!showCamera) {
    return (
      <ScrollView
        onScroll={handleScroll}
        keyboardShouldPersistTaps={'always'}
        style={{ height: '70%' }}
      >
        <View style={{ paddingBottom: 80, height: '100%' }}>
          <View style={{ marginBottom: 30 }}>
            <View style={styles.headersubirImagenesPerfil}>
              <View>
                <Image
                  style={styles.circuloIcon}
                  contentFit="cover"
                  source={
                    provisoryProfileImage
                      ? { uri: provisoryProfileImage }
                      : require('../../assets/avatarr.png')
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPicture('profile');
                    setShowCamera(true);
                  }}
                  style={{
                    right: 0,
                    position: 'absolute',
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    backgroundColor: '#252525',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={{ width: 14, height: 14 }}
                    contentFit="cover"
                    source={require('../../assets/camera.png')}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.botonSubirImagen, { backgroundColor: sportColor }]}
                onPress={() => handlePickImage('profile')}
              >
                <Text style={[styles.subirFotoDe, styles.paso4Typo]}>
                  Subir foto de perfil
                </Text>
              </TouchableOpacity>

              <Text style={[styles.pesoMaximo, styles.atrsTypo]}>
                Max 1mb, jpeg
              </Text>
            </View>
            <View style={styles.rectangulobotonpesoMaximo}>
              {provisoryCoverImage ? (
                <View
                  style={{
                    width: '95%',
                    height: 170,
                    backgroundColor: '#fff',
                    marginTop: 30,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'white',
                      borderRadius: 8,
                    }}
                    contentFit="cover"
                    source={{ uri: provisoryCoverImage }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPicture('cover');
                      setShowCamera(true);
                    }}
                    style={{
                      top: -17,
                      right: 0,
                      position: 'absolute',
                      width: 35,
                      height: 35,
                      borderRadius: 100,
                      backgroundColor: '#252525',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      style={{ width: 14, height: 14 }}
                      contentFit="cover"
                      source={require('../../assets/camera.png')}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    width: '95%',
                    height: 170,
                    backgroundColor: '#fff',
                    marginTop: 30,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPicture('cover');
                      setShowCamera(true);
                    }}
                    style={{
                      top: -17,
                      right: 0,
                      position: 'absolute',
                      width: 35,
                      height: 35,
                      borderRadius: 100,
                      backgroundColor: '#252525',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      style={{ width: 14, height: 14 }}
                      contentFit="cover"
                      source={require('../../assets/camera.png')}
                    />
                  </TouchableOpacity>
                  <Image
                    style={{ width: 130, height: 130 }}
                    contentFit="cover"
                    source={require('../../assets/imagePlaceholder.png')}
                  />
                </View>
              )}
              <TouchableOpacity
                style={[styles.botonSubirImagen, { backgroundColor: sportColor }]}
                onPress={() => handlePickImage('cover')}
              >
                <Text style={[styles.subirFotoDe, styles.paso4Typo]}>
                  Subir foto de portada
                </Text>
              </TouchableOpacity>
              <Text style={[styles.pesoMaximo, styles.atrsTypo]}>
                Max 1mb, jpeg
              </Text>
            </View>
          </View>

          <DetallesSeleccion
            scrolledHeight={scrolledHeight}
            sportmanValues={sportmanValues}
            setSportmanValues={setSportmanValues}
            setSelectedCity={setSelectedCity}
          />
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View
        style={{
          zIndex: 9999,
          height: Dimensions.get('screen').height * 0.6,
        }}
      >
        <CameraView
          ref={cameraReff}
          facing={facing}
          style={{
            zIndex: 9999,
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height * 0.6,
          }}
          zoom={0}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              position: 'relative',
            }}
          >
            <View
              style={{
                position: 'absolute',
                borderWidth: 2,
                borderColor: 'white',
                width: 300,
                height: 300,
                borderRadius: 150,
              }}
            ></View>

            <TouchableOpacity
              style={{ position: 'absolute', top: 40, left: 18 }}
              onPress={() => setShowCamera(false)}
            >
              <Image
                style={{
                  height: 15,
                  width: 15,
                }}
                contentFit="cover"
                source={require('../../assets/group-565.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                width: '100%',
                marginBottom: 30,
                position: 'relative',
              }}
            >
              <TouchableOpacity
                onPress={takePicture}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  backgroundColor: '#cecece',

                  color: 'white',
                }}
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={changePictureMode}
                style={{
                  position: 'absolute',
                  right: 20,
                  color: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Entypo name="cycle" color={'#fff'} size={25} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  atras: {
    color: Color.black,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
    textAlign: 'left',
    fontSize: FontSize.size_5xl,
  },
  atrasTypo: {
    fontFamily: FontFamily.interRegular,
    textAlign: 'left',
    fontSize: FontSize.size_5xl,
  },
  paso4Typo: {
    fontSize: FontSize.size_5xl,
    textAlign: 'left',
  },
  grupoIconLayout: {
    maxWidth: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  rectangulobotonpesoMaximo: {
    width: '100%',
    height: 221,
    marginTop: 40,
    marginBottom: 15,
    alignItems: 'center',
    alignSelf: 'center',
  },
  atras1: {
    lineHeight: 26,
    color: Color.black,
    textAlign: 'left',
  },
  paso4De4: {
    fontSize: FontSize.size_11xl,
    color: Color.black,
    textAlign: 'left',
  },
  icon: {
    width: 18,
    height: 18,
  },
  atrasParent: {
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    justifyContent: 'space-between',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headersubirImagenesPerfil: {
    width: '100%',
    height: 110,
    marginBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  botonSubirImagen: {
    marginTop: 20,
    borderRadius: Border.br_xl,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_4xs,
    alignItems: 'center',
  },
  subirFotoDe: {
    lineHeight: 26,
    color: Color.white,
    fontFamily: FontFamily.interSemibold,
    fontWeight: '600',
    textAlign: 'left',
  },
  pesoMaximo: {
    lineHeight: 19,
    color: '#595959',
    marginTop: 8,
    fontFamily: FontFamily.interRegular,
    textAlign: 'left',
  },
  circuloIcon: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  grupoIcon: {
    height: 490,
  },
  atrasContainer: {
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    justifyContent: 'space-between',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Paso4Jugador;
