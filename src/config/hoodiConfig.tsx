import {createConfig, http} from 'wagmi';
import {hoodi} from 'wagmi/chains';

export const hoodiConfig = createConfig({
    chains: [hoodi],
    transports: {
        [hoodi.id]: http()
    }
})