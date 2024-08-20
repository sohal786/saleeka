import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StatusBar, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import Svg, { Path } from 'react-native-svg';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/button';
import CustomText from '@/components/CustomText';
import { app, auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Set up EStyleSheet
EStyleSheet.build({ $rem: width / 380 });

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleUsernameChange = (text: string) => {
        setForm(prevForm => ({ ...prevForm, email: text }));
    };

    const handlePasswordChange = (text: string) => {
        setForm(prevForm => ({ ...prevForm, password: text }));
    };

    const handleLogin = async () => {
        setIsSubmitting(true);
        try {
            const response = await signInWithEmailAndPassword(auth, form.email, form.password);
            console.log('Logged in!', response);
            // Navigate to your home screen here
            router.replace('/scan');
        } catch (err) {
            console.error(err);
            if (err instanceof FirebaseError) {
                // Handle Firebase errors
                setError(err.message);
            } else {
                // Handle generic errors differently or convert them to a string if needed
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate logo position based on screen height
    const logoTopPosition = height < 700 ? height * 0.05 : height * 0.1;

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ImageBackground
                source={images.bgImage}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    <Image
                        style={[styles.logo, { top: logoTopPosition }]}
                        source={images.logo}
                        resizeMode="contain"
                    />
                </SafeAreaView>
                <Svg
                    height={height}
                    width={width}
                    viewBox={`0 0 ${width} ${height}`}
                    style={styles.svgContainer}
                >
                    <Path
                        d={`M0,${height * 0.42} Q${width / 2},${height * 0.42 - 80} ${width},${height * 0.42} V${height} H0 Z`}
                        fill="#3A6A64"
                    />
                    <Path
                        d={`M0,${height * 0.42 + 40} Q${width / 2},${height * 0.42 + 60 - 100} ${width},${height * 0.42 + 45} V${height} H0 Z`}
                        fill="#2F5651"
                    />
                </Svg>
            </ImageBackground>
            <View style={styles.textSection}>
                <ScrollView contentContainerStyle={[styles.contentContainer, {marginTop: height * 0.43}]}>
                    <CustomText style={styles.loginTitle} fontWeight='semiBold'>Login</CustomText>
                    <CustomText style={styles.loginSubtitle}>Sign in to your account</CustomText>
                    <FormField
                        title="Email"
                        placeholder='Email'
                        value={form.email}
                        handleChangeText={handleUsernameChange}
                        keyboardType="default"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={handlePasswordChange}
                        keyboardType="default"
                        placeholder='Password'
                    />
                    <CustomButton
                        title="Log In"
                        handlePress={handleLogin}
                        isLoading={isSubmitting}
                    />
                    <CustomText style={styles.forgotPassword}>Forgot Password?</CustomText>
                    <View style={styles.signupContainer}>
                        <CustomText style={styles.signupText}>Don't have an account? </CustomText>
                        <Link href="/SignUp" style={styles.signupLink}>Sign Up</Link>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    textSection: {
        flex: 1,
        padding: '20rem',
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
        position: 'absolute',
    },
    svgContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    loginTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loginSubtitle: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    forgotPassword: {
        color: '#FFF',
        fontSize: 16,
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#FFF',
        fontSize: 16,
    },
    signupLink: {
        color: '#FFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default Login;