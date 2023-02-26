import Collapsible from 'components/shared/Collapsible'
import { useState } from 'react'
import {Link} from "../../shared/Link";

export default function ShareForm() {
    const [form, setForm] = useState<{
        handle: string
        name: string
        desc: string
        img: string
        link?: string
    }>({
        handle: '',
        name: '',
        desc: '',
        img: '',
    })

    function handleForm(field, e) {
        setForm((form) => ({ ...form, [field]: e.target.value }))
    }

    return (
        <Collapsible title="Share Your DeadHeads Projects">
            <div className="mt-5 md:mt-6 flex flex-col justify-between gap-y-8 text-sm md:flex-row md:gap-y-0 m-1">
                <p className="md:w-6/12">
                    Fusce dapibus, tellus ac cursus commodo, tortor mauris
                    condimentum nibh, ut fermentum massa justo sit amet risus.
                    Fusce dapibus, tellus ac cursus commodo, tortor mauris
                    condimentum nibh, ut fermentum massa justo sit amet risus.
                    Nullam quis risus eget urna mollis ornare vel eu leo.
                    Integer posuere erat a ante venenatis dapibus posuere velit
                    aliquet.
                </p>
                <div className="flex flex-col gap-y-3 md:w-5/12">
                    <input
                        type="text"
                        placeholder="@twitterhandle"
                        value={form.handle}
                        onChange={(e) => handleForm('handle', e)}
                    />
                    <input
                        type="text"
                        placeholder="Name of project"
                        value={form.name}
                        onChange={(e) => handleForm('name', e)}
                    />
                    <textarea
                        placeholder="description"
                        value={form.desc}
                        onChange={(e) => handleForm('desc', e)}
                    />
                    <label className="w-full border border-gray-1 bg-gray-1 p-3 text-center text-[#D9D9D9] ring-tinted-white hover:cursor-pointer hover:border-tinted-white hover:ring-1 focus:border-tinted-white focus:ring-1">
                        {!form.img ? 'Upload Image' : 'Success!'}
                        <input
                            type="file"
                            className="hidden"
                            value={form.img}
                            onChange={(e) => handleForm('img', e)}
                        />
                    </label>
                    <input
                        type="text"
                        placeholder="Opensea / Mint / Project link (optional)"
                        value={form?.link || ''}
                        onChange={(e) => handleForm('link', e)}
                    />
                    <Link
                        href={`mailto:test@gms?subject=Community%20Project%20Submission&body=${JSON.stringify(form)}`}
                        className="text-center mt-1.5 border border-tinted-white bg-tinted-white p-3 text-black ring-tinted-white hover:bg-transparent hover:text-tinted-white hover:ring-1 focus:bg-transparent focus:text-tinted-white focus:ring-1"
                    >
                        SUBMIT
                    </Link>
                </div>
            </div>
        </Collapsible>
    )
}
