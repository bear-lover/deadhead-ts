import Leaderboard from '../components/Nip'
import camelcaseKeys from 'camelcase-keys'
import axios from 'axios'
import { NIP_API_ENDPOINT, NIP_PROJECT_SLUG } from '../config/constants'

export default function Nip({ project }) {
    return project ? (
        <Leaderboard project={camelcaseKeys(project, { deep: true })} />
    ) : (
            <h2 className="text-2xl md:text-3xl mb-7 text-center">Sorry! NFT Impact Program is not active right now</h2>
    )
}

export async function getServerSideProps() {
    try {
        const { data: project } = await axios.get(
            `${NIP_API_ENDPOINT}/projects/by-slug/${NIP_PROJECT_SLUG}`
        )
        return {
            props: { project: camelcaseKeys(project, { deep: true }) },
        }
    } catch (ex) {
        return {
            props: { project: false },
        }
    }
}