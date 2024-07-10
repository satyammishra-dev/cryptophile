import React from "react";
import { blo } from "blo";

type AvatarProps = {
  address: `0x${string}`;
  size?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Avatar = ({ address, size, ...props }: AvatarProps) => {
  return (
    <div
      {...props}
      className={`rounded-full overflow-hidden inline-block ${props.className}`}
    >
      <img src={blo(address, size)} />
    </div>
  );
};

export default Avatar;
