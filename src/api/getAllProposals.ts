import instanse from "./instanse.ts";

export async function getAllProposals() {
    try {
        const response = await instanse("/api/proposals");

        if (response.status === 200) {
            return response.data;
        }
    } catch(e: any) {
        return { error: e.message || "Error fetching proposals" };
    }

}