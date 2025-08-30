import { useState, useEffect, createContext, useContext } from "react";
import {jwtDecode} from 'jwt-decode'
import api from './api'
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN, GOOGLE_REFRESH_TOKEN } from "./token";

//Create the AuthContext

const AuthContext = createContext({
    isAuthorized: false,
    user: null,
    login: () => {},
    logout: () => {},
});

// AuthProvider component
export const AuthProvider  = ({children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);

  // Function to check and validate token
    const checkAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
        const now = Date.now() / 1000; // Now I made this a global variable
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                //const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    // Token expired, try to refresh
                    await refreshToken();
                } else {
                    // Token is valid
                    setIsAuthorized(true);
                    setUser(decoded);
                }
            } catch(error) {
                // Invalid token
                logout();
            }
        } else if (googleAccessToken) {
            try {
                const googleDecoder = jwtDecode(googleAccessToken);
                const googleTokenExpiration = googleDecoder.exp;
                const isValid = await validateGoogleToken(googleAccessToken);
                console.log(googleAccessToken);
                if (isValid) {
                    setIsAuthorized(true);
                    setUser(googleDecoder);
                
                // } if(googleTokenExpiration < now){
                //     await refreshToken();
                } else {
                    logout();
                }
            } catch(error) {
               //logout();
            }
        } else {
            logout();
        }
    };

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post('/api/token/refresh/', {
                refresh : refreshToken, 
            });

            if(res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                const decoded = jwtDecode(res.data.access);
                setIsAuthorized(true);
                setUser(decoded);
                return true;
            }
        } catch (error){
            console.error('Error refreshing token', error);
            logout; 
        }
        return false;
    };

    const validateGoogleToken = async (googleAccessToken) => {
        try{
            console.log(googleAccessToken);
            const res = await api.post('/api/google/validate_token/', {
                access_token : googleAccessToken,
            });
            console.log(res);
            return res.data.valid;
        } catch (error){
            console.error('Error validating Google token', error);
            return false;
        }
    };

    const login = async (credentials) => {
        try {
            let res;
            if(credentials.google_token){
                // Google login
                res = await api.post('/api/google/login/', {
                    access_token: credentials.google_token
                });
            } else{
                // Regular login
                res = await api.post('/api/token/', credentials);
            }

            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            // maybe I need to set up the localstorage set item for google refresh token here or lets see
            // For regular login, also store refresh token
            if(res.data.refresh){
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            }

            // Trigger auth check
            await checkAuth();
            return true;
        } catch (error){
            console.error('Login failed', error);
            return false;
        }
    }   

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
        setIsAuthorized(false);
        setUser(null);
    };

    //Check auth on mount and set up token refresh interval. 

    useEffect(() => {
        checkAuth();
        
        // Set up an interval to check and refresh token periodically
        const interval = setInterval(() => {
            checkAuth();
        }, 5 * 60 * 1000); // Check every 5 mintues

        return () => clearInterval(interval);
    }, []);  

    return(
        <AuthContext.Provider value={{
            isAuthorized,
            user,
            login,
            logout,
            refreshToken,
        }}>
            {children}
            </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};