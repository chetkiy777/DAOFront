import {useEffect, useState} from "react";
import {getAllProposals} from "../../api/getAllProposals.ts";
import {ProposalType} from "../../types/global";




export const ProposalList = () => {

    const [proposals, setProposals] = useState<ProposalType[]>([]);

    useEffect(() => {
        async function  fetchProposals() {
            const result = await getAllProposals();
            if (result) {
                console.log(result);

                setProposals(result);
            }
        }

        fetchProposals();
    }, []);


    return <div>
        <ul>
            {proposals && proposals.length && proposals.map(p => {
                return <li key={p.id}>
                    <p>About: {p.description}</p>
                    <p>Created At: {p.createdAt}</p>
                </li>
            })}
        </ul>
    </div>;
}