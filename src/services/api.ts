import axios from "axios";


interface verifyData {
    address: string,
    signature: string,
    nonce: string
}

// TODO !!! src/services/api.ts now imitates the SIWE flow:

// Initialize SIWE by returning a fresh nonce for the client to use in the message
export async function getAuth() {
    const response = await axios.get("http://localhost:3007/api/auth/nonce");
    if (response.data.success === true) {
        return response.data.nonce;
    }
}


export async function verify(data: verifyData) {
    const {address, signature, nonce} = data;

    try {
        const result = await axios.post("http://localhost:3007/api/auth/verify", {
            address, signature, nonce
        });

        if (result.status === 200) {
            return { success: true, message: 'Verification successful' };
        }
    } catch(err: any) {
        return { success: false, message: err?.message || 'Verification error' };
    }
}

// Verify a structured EIP-4361 (SIWE) message client-side (mock, no server)
// export async function postAuth(message: SiweMessage | any, signature: string) {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     try {
//         const msg = new SiweMessage(message); // supports string or object
//         const domain = typeof window !== 'undefined' ? window.location.host : msg.domain;
//         const nonce = msg.nonce;
//
//         const result = await msg.verify({
//             signature,
//             domain,
//             nonce,
//         });
//
//         if (!result.success) {
//             return { success: false, message: 'SIWE verification failed' };
//         }
//
//         return {
//             success: true,
//             address: result.data.address,
//             chainId: result.data.chainId,
//             message: 'Mock authentication successful',
//         };
//     } catch (err: any) {
//         return { success: false, message: err?.message || 'Verification error' };
//     }
// }