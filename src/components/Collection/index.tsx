import React from 'react'

const Collection = ({ ercTokenList, fetching }: { ercTokenList?: JSX.Element[], fetching: boolean }) => {
    return (
        <div className="w-full px-4 md:pr-4" >
            <nav className="pt-2">
                <div id="nav-tab" className="-mb-px flex justify-strt">
                    <p className="nav-tab tracking-wide font-semibold text-xl py-3 active">
                        Collection
                    </p>
                </div>
            </nav>
            <div className="tab-pane active">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-8 gap-4  md:m-0">
                    {fetching ? 'fetching' : ercTokenList}
                </div>
            </div>
        </div>
    )
}

export default Collection
