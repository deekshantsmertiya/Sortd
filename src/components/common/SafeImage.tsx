"use client";

import React, { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

export const IMAGE_PLACEHOLDER = "/placeholder-image.svg";

/** next/image that swaps to a neutral placeholder if the image is missing or fails to load. */
export default function SafeImage({ src, alt, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const finalSrc = failed || !src ? IMAGE_PLACEHOLDER : src;
  return (
    <Image
      {...rest}
      src={finalSrc}
      alt={alt}
      unoptimized={finalSrc === IMAGE_PLACEHOLDER || rest.unoptimized}
      onError={() => setFailed(true)}
    />
  );
}
