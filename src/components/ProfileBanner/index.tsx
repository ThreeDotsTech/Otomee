import React from 'react'
import Banner from 'assets/images/banner.png'

const ProfileBanner = () => {
    return (
        <div className="relative h-56 overflow-visible">

            <img id="cover" className="absolute object-cover h-56 w-full"
                src={Banner}
                alt="{{ profile.user.username }}" />


        </div>
    )
}

export default ProfileBanner
