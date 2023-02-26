import { Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { MONTHLY_REWWARDS, STAKE_PERIODS } from 'config/constants'

interface StakePeriodSelectProps {
    period: number
    setPeriod: (period: number) => void
    disabled?: boolean
}
export default function ({
    period,
    setPeriod,
    disabled = false,
}: StakePeriodSelectProps) {
    return (
        <Listbox value={period} onChange={setPeriod} disabled={disabled}>
            <div className="relative w-60">
                <Listbox.Button className="relative justify-start w-full cursor-default rounded-md border border-tinted-white bg-black py-2 pl-4 pr-10 text-left shadow-md ring-opacity-75 ring-offset-2 ring-offset-black focus:outline-none focus:ring-1 focus:ring-tinted-white sm:text-sm">
                    <span className="block truncate">{period} ($SHOW {MONTHLY_REWWARDS[period] / 4} / week)</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Listbox.Options className="absolute justify-start mb-1 bottom-full max-h-60 w-full overflow-auto rounded-md border border-tinted-white bg-black py-2 text-base shadow-lg focus:outline-none sm:text-sm z-10">
                    {STAKE_PERIODS.map((period) => (
                        <Listbox.Option
                            key={period}
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-4 pr-10 ${
                                    active
                                        ? 'bg-tinted-white text-black'
                                        : 'text-tinted-white'
                                }`
                            }
                            value={period}
                        >
                            {({ selected }) => (
                                <>
                                    <span
                                        className={`block truncate ${
                                            selected
                                                ? 'font-medium'
                                                : 'font-normal'
                                        }`}
                                    >
                                        {period} ($SHOW {MONTHLY_REWWARDS[period] / 4} / week)
                                    </span>
                                    {selected ? (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    )
}
