import React, { useEffect, useState } from 'react'
import clsx from 'clsx';

type Props = {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    fallback?: string;
    style?: React.CSSProperties;
}

const ImageWithFallBack = ({
    width = 500,
    height = 500,
    src,
    alt,
    className,
    style,
    fallback: customFallBack = '/static/images/default-fallback-image.jpg', ...props }: Props) => {
    
        const initialSrc = (src && src.trim() !== "") ? src : customFallBack;
    const [srcImg, setSrcImg] = useState<string>(initialSrc);

    useEffect(() => {
        const nextSrc = (src && src.trim() !== "") ? src : customFallBack;
        setSrcImg(nextSrc);
    }, [src, customFallBack]);
    return (
        <>
            <img
                width={width}
                height={height}
                style={style}
                className={clsx(className)}
                alt={alt}
                src={srcImg}
                loading="lazy"
                decoding="async"
                {...props}
                onError={() => {

                    if (srcImg !== customFallBack) {
                        setSrcImg(customFallBack);
                    }
                }}>
            </img>
        </>
    )
}

export default ImageWithFallBack