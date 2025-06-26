"use client";

export type ListItem = {
  image?: string;
  title: string;
  description: string;
};

export default function List({ data }: { data: ListItem[] }) {
  const handleClick = (title: string) => {
    // Placeholder for future click functionality
    console.log(`Clicked on: ${title}`);
  };

  return (
    <>
      {data.map((item, index) => (
        // Make each item as a clickable div
        <div
          key={index}
          style={{ cursor: "pointer", padding: "8px 0" }}
          onClick={() => handleClick(item.title)}>   
          {item.title}
        </div>
      ))}
    </>
  );
}
