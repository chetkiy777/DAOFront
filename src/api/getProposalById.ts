import instanse from "./instanse.ts";

export async function getProposalById({id}: {id: string}) {
    try {
        const response = await instanse(`/api/proposals/${id}`);

        if (response.status === 200) {
            return response.data;
        }
    } catch(e: any) {
        return { error: e.message || "Error fetching proposals" };
    }

}