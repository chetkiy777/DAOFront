import axios from "axios";

export const useAuth = () => {

    const getNonce = async () => {
        try {
            const response = await axios.get("http://localhost:3007/api/auth/nonce");
            if (response.data.success === true) {
                return response.data.nonce;
            }
        } catch (e: any) {
            throw new Error(`Failed to get nonce: ${e.message}`);
        }
    }


    const verifyNonce = async (nonce: string) => {
        try {
            const respone = await axios.post("http://localhost:3007/api/auth/verify", {
                nonce
            });

            if (respone.status === 200) {
                return respone.data
            }
        } catch(e: any) {
            return console.error(e.message ?? "request error")
        }

    }



    return {
        getNonce,
        verifyNonce
    }
}