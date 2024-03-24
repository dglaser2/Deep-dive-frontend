import axios from "axios"
import { Alert } from "react-native"

export const loginAPI = async (email, password) => {
    const body = {
        "email": email,
        "password": password,
        // "client_id": API_ID_PROD,
        // "client_secret": SECRET_PROD,
        "grant_type": "password"
    }
    try {
        const response = await axios({
            method: 'post',
            // url: API_ENDPOINT_PROD + '/login',
            data: body
        })
        return response.data.data.tokens.access_token
    } catch (error) {
        Alert.alert(error.response.data.message)
        return
    }
}