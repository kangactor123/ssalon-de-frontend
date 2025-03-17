import { ContentType } from "recharts/types/component/DefaultLegendContent";

const customLegend: ContentType = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap justify-center">
      {payload.map((entry, index) => (
        <li
          key={`item${index}`}
          className="flex items-center mr-[10px] text-[10px]"
        >
          <span
            className="inline-block w-[10px] h-[10px] rounded-full mr-1"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export { customLegend };
