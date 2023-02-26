import { useState } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

export function SearchBar({ id, placeholder, search, setSearch }) {
    const [borderColor, setBorderColor] = useState("ring-0")
    const [scale, setScale] = useState("")
    const styleFocus = () => {
        setBorderColor('ring-1')
        setScale("scale-125")
    }
    const styleBlur = () => {
        setBorderColor('')
        setScale("")
    }

    return (
        <div className="md:flex py-4 md:p-6 md:bg-dull-gray md:mb-7">
            <div className={"flex shrink w-full bg-dull-gray border border-gray-2 hover:ring-1 ring-gray-2 " + borderColor}>
                <label className="hidden" htmlFor={id}>
                    {id}
                </label>
                <input
                    className="placeholder:text-gray-2 bg-transparent h-10 w-full pl-4 focus:ring-0 border-0 hover:ring-0 text-xs "
                    id={id}
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={styleFocus}
                    onBlur={styleBlur}
                />
                <div className="bg-gray-2">
                    <SearchIcon className={"w-10 h-10 p-2 text-black transition " + scale}/>
                </div>
            </div>
        </div>

    )
}
