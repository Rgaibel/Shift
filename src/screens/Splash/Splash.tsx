import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
// import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {RootStackParamList} from '../../navigation';
// import {AppDispatch} from '../../redux/store';
// import {useDispatch} from 'react-redux';
// import {enableBLE, yardEntered} from '../../services/BLE/BLE';
// import {setLocationLoaded} from '../../redux/actions';
// import {
//   getLocation,
//   listenToPosition,
//   lookupCountry,
// } from '../../services/geolocation/geolocation';
// // import {Auth} from 'aws-amplify';
// import {GeoPosition} from 'react-native-geolocation-service';
// import {postListingsToBackend} from '../../ListingLogic/ListingLogic';
// import {getJSONData} from '../../services/storage/AsyncStorage';
// import {useIsFocused} from '@react-navigation/native';
// import {GETBusinessData} from '../../services/API/BackEndAPI';
// import {countryCodes} from 'react-native-country-codes-picker/constants/countryCodes';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash: React.FC<Props> = () => {
  //   const dispatch = useDispatch<AppDispatch>();
  //   const isFocused = useIsFocused();
  //   const [locationIsSet, setLocationIsSet] = useState(false);
  //   const [bleIsSet, setBleIsSet] = useState(false);

  //   async function setCountryCode(pos: GeoPosition) {
  //     const {latitude, longitude} = pos.coords;
  //     const userCountryCode = await lookupCountry({latitude, longitude});
  //     countryCodes.forEach(countryVal => {
  //       if (countryVal.name.en === userCountryCode) {
  //         console.log('signin');
  //         props.navigation.navigate('SignIn', {
  //           countryCode: countryVal.dial_code ?? '+972',
  //         } as never);
  //       }
  //     });
  //   }

  //   async function SignIn() {
  //     await NetInfo.fetch().then((value: NetInfoState) => {
  //       if (value.isConnected) {
  //         // getLocation(setCountryCode, () =>
  //         //   console.warn('permission was rejected'),
  //         // );
  //       } else {
  //         ToastAndroid.show(
  //           '   No Internet Connection \n Please turn it on to sign in',
  //           ToastAndroid.LONG,
  //         );
  //       }
  //     });
  //   }

  //   const checkUser = async () => {
  //     if (locationIsSet) {
  //       console.log('running this again from splash');
  //       await getJSONData('user')
  //         .then((user: any) => GETBusinessData(user, dispatch))
  //         .then(() => {
  //           setTimeout(async () => {
  //             postListingsToBackend(() => props.navigation.navigate('Sync'));
  //           }, 4000);
  //         })
  //         .catch((error: any) => {
  //           console.log('failure in flow.. ', error.message);
  //           SignIn();
  //         });
  //     } else {
  //       console.log('waiting until a location is set');
  //     }
  //   };

  //   useEffect(() => {
  //     console.log(1);
  //     if (!bleIsSet) {
  //       //   dispatch(enableBLE(setBleIsSet));
  //     }
  //   }, [bleIsSet]);

  //   useEffect(() => {
  //     let mounted: boolean = true;
  //     console.log(2);
  //     if (bleIsSet) {
  //       //   listenToPosition(
  //       //     async (position: GeoPosition) => {
  //       //       //   const location = {
  //       //       //     longitude: position.coords.longitude,
  //       //       //     latitude: position.coords.latitude,
  //       //       //   };
  //       //       //   dispatch(setLocationLoaded(location));
  //       //       //   dispatch(yardEntered(location));
  //       //       if (mounted) {
  //       //         setLocationIsSet(true);
  //       //       }
  //       //     },
  //       //     (err: string) => {
  //       //       console.log('err', err);
  //       //     },
  //       //   );
  //     }
  //     return () => {
  //       mounted = false;
  //     };
  //   }, [bleIsSet]);

  //   useEffect(() => {
  //     console.log(3);
  //     if (isFocused && locationIsSet && bleIsSet) {
  //       console.log('now ready to check user');
  //       checkUser();
  //     }
  //   }, [isFocused, locationIsSet, bleIsSet]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/modern-background-connecting-lines-dots.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.mainContainer}>
          {/* image */}
          <Image
            source={require('./../../assets/list-icon.png')}
            resizeMode="center"
          />
        </View>
        {/* <View style={styles.bottomContainer}>
          <Text style={styles.text}>V1.5</Text>
        </View> */}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231F20',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: 'transparent',
    borderWidth: 1,
  },
  text: {
    color: 'gray',
  },
});
