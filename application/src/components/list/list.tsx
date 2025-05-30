"use client";

type ListItem = {
  image?: String;
  title: String;
  description: String;
};

interface Props {
  data: Array<ListItem>;
}

const List: React.FC<Props> = ({ data }) => {
  return data.map((item, index) => <div key={index}>{item.title}</div>);
};

export default List;
export type { ListItem };
