import { SupportedNFTInterfaces } from "constants/ERC165"
import { DEFAULT_ENS_METADATA_URL_PREFIX, OPENSEA_METADATA_API_URL_PREFIX } from "constants/misc"
import { METHODS } from "http"
import { useEffect, useMemo, useState } from "react"
import uriToHttp from "utils/uriToHttp"
import { useERC721Data } from "./useNFTName"
import { useERC1155Uri, useERC721Uri } from "./useNFTuri"

export function useNFTMetadata(address: string, id: string): {
    title: string,
    image: string,
    animation: string,
    description: string,
    loading: boolean,
    attributesList?: any,
    collectionName: string,
    owner: string
} {
    const memoid = useMemo(() => id, [id])

    const erc721 = useERC721Uri(address, memoid, false)
    const erc1155 = useERC1155Uri(address, memoid, false)
    const uri = erc721.uri || erc1155.uri
    const loading = erc721.loading && erc1155.loading
    let http = uri && uriToHttp(uri)[0]
    const ercData = useERC721Data(address)

    const [image, setImage] = useState('')
    const [collectionName, setcollectionName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [animation, setAnimation] = useState('')
    const [LoadingMemo, setLoadingMemo] = useState(false)
    const [AttributesList, setAttributesList] = useState<any>(undefined)




    function setAttributes({ image_, name_, image_url, description_, attributes, animation_, animationUrl_ }: { image_?: string, name_?: string, image_url?: string, description_?: string, attributes?: string, animationUrl_?: string, animation_?: string }) {
        name_ ? setTitle(name_) : setTitle(memoid)
        image_ ? setImage(uriToHttp(image_)[0]) : image_url && setImage(uriToHttp(image_url)[0])
        animation_ && setAnimation(uriToHttp(animation_)[0])
        animationUrl_ && setAnimation(uriToHttp(animationUrl_)[0])
        description_ && setDescription(description_)
        attributes && setAttributesList(attributes)
    }

    useEffect(() => {
        if (image != '') {
            fetch(image, { method: "HEAD" }).then(function (res) {
                if (res.headers.get('Content-Type')?.split('/')[0] == 'video') {
                    setAnimation(image)
                    setImage('')
                }

            }).catch(() => fetch('https://proxy.otomee.com/?' + image, { method: "HEAD" }).then(function (res) {
                if (res.headers.get('Content-Type')?.split('/')[0] == 'video') {
                    setAnimation(image)
                    setImage('')
                }
            })).catch((e) => console.log('got error' + e))
        }
        if (animation != '') {
            fetch(animation, { method: "HEAD" }).then(function (res) {
                if (res.headers.get('Content-Type')?.split('/')[0] == 'image') {
                    setImage(animation)
                    setAnimation('')
                }
            }).catch(() => fetch('https://proxy.otomee.com/?' + animation, { method: "HEAD" }).then(function (res) {
                if (res.headers.get('Content-Type')?.split('/')[0] == 'video') {
                    setAnimation(animation)
                    setImage('')
                }
            })).catch((e) => console.log('got error' + e))
        }
    }, [image, animation])

    useEffect(() => {
        let failed = false
        if (uri == null && !loading) {
            switch (address) {
                case '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85': //ENS
                    http = DEFAULT_ENS_METADATA_URL_PREFIX + memoid
                    setcollectionName('ENS')
                    break;
                case '0x2a187453064356c898cae034eaed119e1663acb8': //ENS
                    http = OPENSEA_METADATA_API_URL_PREFIX + '0x2a187453064356c898cae034eaed119e1663acb8' + '/' + memoid
                    setcollectionName('Decentraland Names')
                    break;
                default:
                    console.log('Irregular collection found:' + address)
                    ercData.name && (setTitle(ercData.name))
                    break;
            }
        }

        if (http && !loading) {
            setLoadingMemo(true)
            fetch(http)
                .then(function (res) {
                    if (!res.ok) failed = true
                    return res.json()

                })
                .then(({ image, name, image_url, description, attributes, animation_url, animation }) => {
                    setAttributes({
                        image_: image,
                        name_: name,
                        image_url: image_url,
                        description_: description,
                        attributes: attributes,
                        animationUrl_: animation_url,
                        animation_: animation
                    })
                })
                .catch(() => fetch('https://proxy.otomee.com/?' + http).then(function (res) { //Try again, this time with proxy
                    if (res.ok) failed = false
                    return res.json()
                })
                    .then(({ image, name, image_url, description, attributes, animation_url, animation }) => {
                        setAttributes({
                            image_: image,
                            name_: name,
                            image_url: image_url,
                            description_: description,
                            attributes: attributes,
                            animationUrl_: animation_url,
                            animation_: animation
                        })

                    })).catch((e) => console.log('got error' + e)).finally(function () {
                        setLoadingMemo(false)
                    })

        } else if (failed && !loading && !ercData.loading) {
            ercData.name ? setTitle(ercData.name + " # " + Number(memoid.split('/')[1])) : setTitle("Couldn't fetch NFT's URI fromName")
        }

        ercData.name && (setcollectionName(ercData.name))

        return function () {
            setImage('')
            setAnimation('')
            setcollectionName('')
            setAttributesList([])
            setLoadingMemo(false)
            setDescription('')
            setTitle('')
        }
    }, [ercData.name, http, loading, uri,])

    return {
        title: title,
        image: image,
        animation: animation,
        description: description,
        loading: loading || LoadingMemo,
        attributesList: AttributesList ?? null,
        collectionName: collectionName,
        owner: erc721.owner || ''
    }

}