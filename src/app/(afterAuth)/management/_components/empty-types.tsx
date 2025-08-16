type Props = {
  type?: string;
};

const EmptyTypes: React.FC<Props> = ({ type = "타입" }) => {
  const comment = `등록된 ${type}이 없습니다.`;
  return (
    <div className="w-full h-full">
      <p className="text-lg text-gray-500 text-center">{comment}</p>
    </div>
  );
};

export default EmptyTypes;
