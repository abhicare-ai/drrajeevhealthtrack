import Image from "next/image";
import avartPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avartPlaceHolder}
      alt=""
      width={size ?? 48}
      className={cn(
        "bg-secondary aspect-square h-fit flex-none rounded-full object-cover",
        className,
      )}
    />
  );
}
