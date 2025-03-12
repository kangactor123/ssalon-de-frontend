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
          key={`item-${index}`}
          style={{
            marginRight: 10,
            display: "flex",
            alignItems: "center",
            fontSize: "10px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: entry.color,
              marginRight: 4,
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export { customLegend };
