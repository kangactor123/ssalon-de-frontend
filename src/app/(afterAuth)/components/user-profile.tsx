import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Skeleton } from "@/shared/ui/skeleton";
import { User } from "lucide-react";

type Props = {
  name?: string;
  email?: string;
  imageSrc?: string;
  isLoading?: boolean;
};

const UserProfileSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 animate-pulse">
      <Skeleton className="w-8 h-8 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-24 h-4 bg-gray-200 rounded" />
        <Skeleton className="w-32 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

const UserProfile: React.FC<Props> = ({ name, email, isLoading, imageSrc }) => {
  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={imageSrc} />
        <AvatarFallback>
          <User color="#6B7280" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <p className="font-medium text-gray-700">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
