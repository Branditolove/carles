import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'expo-image'
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
  StatusBar,
  Platform
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  FontSize,
  Color,
  Padding,
  Border,
  FontFamily
} from '../../GlobalStyles'
import CheckBox from 'react-native-check-box'
import { useDispatch, useSelector } from 'react-redux'
import { create, getAllUsers } from '../../redux/actions/users'
import { AntDesign } from '@expo/vector-icons'
import PassView from './passview'
import HomeGif from '../../utils/HomeGif'
import OjoCerradoSVG from '../../components/svg/OjoCerradoSVG'
import { getAuth, GoogleAuthProvider, signInWithPopup, linkWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

const registerOrLinkGoogleAccount = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      // Si el usuario ya existe, vincula el nuevo método de autenticación
      console.log("El usuario ya existe:", userSnapshot.data());
      if (!user.providerData.some((provider) => provider.providerId === googleProvider.providerId)) {
        await linkWithPopup(user, googleProvider);
        console.log("Cuenta de Google vinculada");
      }
    } else {
      // Si no existe, crea un nuevo usuario
      await setDoc(userDocRef, {
        email: user.email,
        providers: [user.providerData[0].providerId],
      });
      console.log("Nuevo usuario creado");
    }
  } catch (error) {
    console.error("Error al registrar o vincular cuenta de Google: ", error);
  }
};

const Registrarse = () => {
  const [nombreError, setNombreError] = useState('')
  const navigation = useNavigation()

  const route = useRoute()

  const dispatch = useDispatch()

  const { isSportman, allUsers } = useSelector((state) => state.users)
  const { isPlayer } = route.params

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)

  const [isChecked, setChecked] = useState(false)
  const [valuesUser, setValuesUser] = useState({
    nickname: '',
    password: '',
    email: '',
    type: isSportman === true ? 'sportman' : 'club'
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEmailValid, setEmailValid] = useState(false)
  const [passview1, setPassview1] = useState(true)
  const [passview2, setPassview2] = useState(false) // Se cambió a false para mostrar la contraseña por defecto

  useEffect(() => {
    dispatch(getAllUsers())
  }, [])

  const isValidEmail = (email) => {
    const alreadyTaken = allUsers?.map((user) => user.email).includes(email)
    if (!alreadyTaken) {
      return /^[^\s@]+@[^\s@]+\.(?:com|net|org|edu|gov|mil|biz|info|name|museum|us|ca|uk|fr|au|de)$/i.test(
        email
      )
    } else {
      return false
    }
  }

  const seterValues = (field, value) => {
    setValuesUser((prev) => ({
      ...prev,
      [field]: value
    }))
    if (field === 'email') {
      setEmailValid(isValidEmail(value))
    }
  }

  const handleCheckboxToggle = () => {
    setChecked(!isChecked)
  }

  const submit = async () => {
    if (
      valuesUser.email &&
      valuesUser.nickname &&
      valuesUser.password &&
      isChecked
    ) {
      if (isValidEmail(valuesUser.email)) {
        const existingUser = allUsers?.find(
          (user) => user.email === valuesUser.email
        )
        if (existingUser) {
          Alert.alert('Este correo electrónico ya está registrado')
          return
        }
        if (valuesUser.password === confirmPassword) {
          try {
            // Crea el usuario con email y contraseña
            await createUserWithEmailAndPassword(auth, valuesUser.email, valuesUser.password);
            
            // Guarda la información del usuario en Firestore
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userDocRef, {
              email: valuesUser.email,
              providers: ['password'],
              nickname: valuesUser.nickname
            });

            // Actualiza el estado en Redux
            dispatch(create(valuesUser))

            navigation.navigate('IniciarSesin', { isPlayer })
          } catch (error) {
            console.error("Error al registrar usuario: ", error);
            Alert.alert('Error al registrar usuario')
          }
        } else {
          Alert.alert('Las contraseñas no coinciden')
        }
      }
    } else {
      Alert.alert('Debes llenar todos los campos')
    }
  }

  const { height, width } = useWindowDimensions()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Color.bLACK1SPORTSMATCH
        }}
      >
        <HomeGif></HomeGif>
        <View
          style={{
            flex: 1,
            height: height - StatusBar.currentHeight,
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            style={styles.botonAtrasFrame}
          >
            <Image
              style={styles.simboloIcon}
              contentFit="cover"
              source={require('../../assets/coolicon3.png')}
            />
            <Pressable
              onPress={() => {
                navigation.goBack()
              }}
              style={{ marginLeft: 5 }}
            >
              <Text style={[styles.atrs1, styles.timeTypo]}>Atrás</Text>
            </Pressable>
          </TouchableOpacity>
          <View style={styles.formulariotextoLegal}>
            <View style={styles.formularioFrame}>
              <View style={styles.camposFormulario}>
                <View style={styles.titularcampos}>
                  <Text style={[styles.titular, styles.titularLayout]}>
                    Regístrate
                  </Text>

                  <View style={styles.campos}>
                    <View style={styles.campo1}>
                      <View
                        style={{
                          gap: 5,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingHorizontal: Padding.p_mini,
                          borderColor: Color.gREY2SPORTSMATCH,
                          borderWidth: 1,
                          borderRadius: Border.br_81xl,
                          flexDirection: 'row',
                          height: 40
                        }}
                      >
                        <Image
                          style={styles.simboloIcon1}
                          contentFit="cover"
                          source={require('../../assets/simbolo4.png')}
                        />
                        <TextInput
                          style={{
                            color: Color.wHITESPORTSMATCH,
                            fontFamily: FontFamily.t4TEXTMICRO,
                            fontSize: FontSize.t2TextSTANDARD_size,
                            marginLeft: 10,
                            textAlign: 'left',
                            width: '80%'
                          }}
                          placeholder="Nombre"
                          placeholderTextColor="#999"
                          value={valuesUser.nickname}
                          onChangeText={(value) => {
                            if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
                              // Si la entrada coincide con la expresión regular o está vacía, actualizar el estado y limpiar el mensaje de error
                              console.log(`nickname: ${value}`) // Log nickname value
                              seterValues('nickname', value)
                              setNombreError('')
                            } else {
                              // Si la entrada no coincide con la expresión regular, establecer el mensaje de error apropiado
                              setNombreError(
                                'Nombre no puede contener números ni caracteres especiales'
                              )
                            }

                            // Verificar si se excedió el máximo de caracteres
                            if (value.length > 60) {
                              // Si se excede el máximo de caracteres, establecer el mensaje de error correspondiente
                              setNombreError('Caracteres excedidos')
                            }
                          }}
                          onSubmitEditing={() => {
                            emailInputRef.current.focus()
                          }}
                          maxLength={60}
                        />
                      </View>
                    </View>
                    <View style={styles.campo2}>
                      <View
                        style={{
                          gap: 5,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingHorizontal: Padding.p_mini,
                          borderColor: Color.gREY2SPORTSMATCH,
                          borderWidth: 1,
                          borderRadius: Border.br_81xl,
                          flexDirection: 'row',
                          height: 40
                        }}
                      >
                        <Image
                          style={styles.simboloIcon2}
                          contentFit="cover"
                          source={require('../../assets/simbolo5.png')}
                        />
                        <TextInput
                          ref={emailInputRef}
                          style={{
                            color: Color.wHITESPORTSMATCH,
                            fontFamily: FontFamily.t4TEXTMICRO,
                            fontSize: FontSize.t2TextSTANDARD_size,
                            marginLeft: 10,
                            textAlign: 'left',
                            width: '80%'
                          }}
                          placeholder="Correo electrónico"
                          placeholderTextColor="#999"
                          value={valuesUser.email}
                          onChangeText={(value) => {
                            seterValues('email', value)
                          }}
                          onSubmitEditing={() => {
                            passwordInputRef.current.focus()
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.campo3}>
                      <View
                        style={{
                          gap: 5,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingHorizontal: Padding.p_mini,
                          borderColor: Color.gREY2SPORTSMATCH,
                          borderWidth: 1,
                          borderRadius: Border.br_81xl,
                          flexDirection: 'row',
                          height: 40
                        }}
                      >
                        <Image
                          style={styles.simboloIcon3}
                          contentFit="cover"
                          source={require('../../assets/simbolo6.png')}
                        />
                        <PassView
                          style={styles.entrada}
                          isVisible={passview1}
                          onPress={() => setPassview1(!passview1)}
                          onChangeText={(value) => seterValues('password', value)}
                          placeholder="Contraseña"
                          value={valuesUser.password}
                          ref={passwordInputRef}
                          onSubmitEditing={() => {
                            confirmPasswordInputRef.current.focus()
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.campo4}>
                      <View
                        style={{
                          gap: 5,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingHorizontal: Padding.p_mini,
                          borderColor: Color.gREY2SPORTSMATCH,
                          borderWidth: 1,
                          borderRadius: Border.br_81xl,
                          flexDirection: 'row',
                          height: 40
                        }}
                      >
                        <Image
                          style={styles.simboloIcon4}
                          contentFit="cover"
                          source={require('../../assets/simbolo7.png')}
                        />
                        <PassView
                          style={styles.entrada}
                          isVisible={passview2}
                          onPress={() => setPassview2(!passview2)}
                          onChangeText={(value) => setConfirmPassword(value)}
                          placeholder="Confirmar contraseña"
                          value={confirmPassword}
                          ref={confirmPasswordInputRef}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.errorMessage,
                      { color: nombreError ? Color.rEDED2 : 'transparent' }
                    ]}
                  >
                    {nombreError}
                  </Text>
                </View>

                <CheckBox
                  style={styles.checkbox}
                  onClick={handleCheckboxToggle}
                  isChecked={isChecked}
                  rightText="Acepto los términos y condiciones"
                  rightTextStyle={{ color: Color.wHITESPORTSMATCH }}
                  checkBoxColor={Color.wHITESPORTSMATCH}
                  uncheckedCheckBoxColor={Color.gREY2SPORTSMATCH}
                  underlayColor="transparent"
                />
                <Pressable
                  style={styles.boton1}
                  onPress={submit}
                >
                  <Text style={[styles.boton1Texto, styles.boton1Texto1]}>
                    Registrarse
                  </Text>
                </Pressable>
                <View
                  style={{
                    marginVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      color: Color.wHITESPORTSMATCH,
                      fontSize: FontSize.t2TextSTANDARD_size
                    }}
                  >
                    O regístrate con
                  </Text>
                  <Pressable onPress={registerOrLinkGoogleAccount} style={styles.googleLogin}>
                    <AntDesign name="google" size={24} color="white" />
                    <Text style={styles.googleText}>Google</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  formularioFrame: {
    backgroundColor: Color.bLACK1SPORTSMATCH,
    borderRadius: Border.br_21xl,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: Padding.p_mini
  },
  formularioTextoLegal: {
    paddingHorizontal: Padding.p_mini,
    paddingVertical: Padding.p_sm,
    alignItems: 'center'
  },
  camposFormulario: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: Padding.p_mini
  },
  titularcampos: {
    marginBottom: 20
  },
  titular: {
    fontSize: FontSize.size_36,
    fontFamily: FontFamily.t4TEXTMICRO,
    color: Color.wHITESPORTSMATCH
  },
  campos: {
    gap: 15
  },
  campo1: {
    marginBottom: 15
  },
  campo2: {
    marginBottom: 15
  },
  campo3: {
    marginBottom: 15
  },
  campo4: {
    marginBottom: 15
  },
  boton1: {
    backgroundColor: Color.bLUE1SPORTSMATCH,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: Border.br_81xl,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boton1Texto: {
    color: Color.wHITESPORTSMATCH,
    fontSize: FontSize.t2TextSTANDARD_size,
    fontFamily: FontFamily.t4TEXTMICRO
  },
  boton1Texto1: {
    fontWeight: 'bold'
  },
  botonAtrasFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Padding.p_mini,
    marginVertical: Padding.p_sm
  },
  simboloIcon: {
    width: 24,
    height: 24
  },
  simboloIcon1: {
    width: 20,
    height: 20
  },
  simboloIcon2: {
    width: 20,
    height: 20
  },
  simboloIcon3: {
    width: 20,
    height: 20
  },
  simboloIcon4: {
    width: 20,
    height: 20
  },
  errorMessage: {
    fontSize: FontSize.t2TextSTANDARD_size,
    marginTop: 5
  },
  checkbox: {
    marginBottom: 20
  },
  googleLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: Border.br_81xl
  },
  googleText: {
    color: 'white',
    marginLeft: 10,
    fontSize: FontSize.t2TextSTANDARD_size
  }
})

export default Registrarse
